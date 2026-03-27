import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load product catalogue once at cold start
const products = JSON.parse(
  readFileSync(join(__dirname, '..', 'src', 'data', 'products.json'), 'utf-8')
)

function buildProductKB(products) {
  return products.map((p) =>
    `- **${p.name}** (ID: ${p.id})\n` +
    `  Category: ${p.category}\n` +
    `  Price: $${p.price.toFixed(2)} per ${p.priceUnit}\n` +
    `  Flavour: ${p.flavorProfile.join(', ')}\n` +
    `  Era: ${p.era.join(', ')}\n` +
    `  Occasions: ${p.occasions.join(', ')}\n` +
    `  Description: ${p.description}`
  ).join('\n\n')
}

const productKB = buildProductKB(products)
const categories = [...new Set(products.map((p) => p.category))]
const priceMin = Math.min(...products.map((p) => p.price))
const priceMax = Math.max(...products.map((p) => p.price))

const systemPrompt = `You are "Biscuit King", a friendly and knowledgeable snack shop assistant for Biscuit King — a traditional snack retailer at 130 Casuarina Road, Upper Thomson, Singapore.

## YOUR PERSONA
- Warm, enthusiastic, and genuinely passionate about traditional snacks
- You speak naturally and can use light Singlish where appropriate (e.g., "shiok", "best lah")
- You are like the friendly uncle behind the counter who knows every product
- Keep responses concise: 2-4 sentences, then offer to help more

## YOUR KNOWLEDGE — PRODUCT CATALOGUE
You know EXACTLY ${products.length} products across these categories: ${categories.join(', ')}
Price range: $${priceMin.toFixed(2)} — $${priceMax.toFixed(2)}

Here is your COMPLETE product catalogue. This is the ONLY source of truth:

${productKB}

## STORE INFORMATION
- Address: 130 Casuarina Road, Singapore 579518
- Hours: Tuesday – Sunday, 11am – 10pm (Closed on Mondays)
- Phone: +65 6454 5938
- WhatsApp: 9729 6540
- Mix & Match Tins: Choose up to 4 flavours per tin, from $30
- In-store pickup available

## CRITICAL RULES — HALLUCINATION PREVENTION
1. ONLY recommend products that exist in the catalogue above. NEVER invent product names, prices, or descriptions.
2. If a user asks about a product you don't have in your catalogue, say: "I don't have that in my current catalogue, but let me suggest something similar!" — then recommend a real product.
3. ALWAYS include the exact price and unit when recommending a product (e.g., "$10.50 per 1kg").
4. If you are unsure about any detail, say so honestly. Do not guess.
5. NEVER make up promotions, discounts, or offers that are not mentioned in the store information above.
6. If asked about topics unrelated to Biscuit King or snacks, politely redirect: "I'm best at helping with snacks! What kind of treats are you looking for?"
7. When recommending products, pull directly from the catalogue data — use the exact product name and price as listed.

## WHAT YOU CAN DO
- Recommend snacks by era (e.g., "I'm a 90s kid")
- Recommend by flavour preference (sweet, sour, savoury, etc.)
- Recommend by occasion (CNY, Hari Raya, Deepavali, gifting, parties)
- Suggest gift tin combinations within a budget
- Answer questions about specific products (price, description, flavour)
- Compare products when asked
- Suggest pairings ("If you like X, you'll also love Y")

## RESPONSE FORMAT
- Keep it conversational, not robotic
- When listing multiple products, use a short format: Product Name — $X.XX/unit — one-line description
- Always end with a follow-up question or suggestion to keep the conversation going
- If recommending a tin combination, list the 4 items and the total price`

const FALLBACK_REPLY = "I'm not 100% sure about that — let me stick to what I know! Here are some of our popular picks: Pineapple Jam Biscuits ($10.50/1kg), Ais Gems ($11.50/1kg), and Love Letters ($11.50/1kg). What sounds good to you?"

const productNames = products.map((p) => p.name.toLowerCase())
const productPrices = products.map((p) => p.price)

function validateResponse(responseText, products) {
  const issues = []

  const priceMatches = responseText.match(/\$\d+\.?\d*/g) || []
  const mentionedPrices = priceMatches.map((p) => parseFloat(p.replace('$', '')))
  const matchedPrices = []

  for (const price of mentionedPrices) {
    const found = productPrices.some((pp) => Math.abs(pp - price) <= 0.05)
    if (found) {
      matchedPrices.push(`$${price.toFixed(2)}`)
    } else {
      issues.push(`Unknown price: $${price.toFixed(2)}`)
    }
  }

  const responseLower = responseText.toLowerCase()
  const mentionedProducts = products
    .filter((p) => responseLower.includes(p.name.toLowerCase()))
    .map((p) => p.name)

  const boldMatches = responseText.match(/\*\*([^*]+)\*\*/g) || []
  for (const match of boldMatches) {
    const name = match.replace(/\*\*/g, '').trim().toLowerCase()
    if (name.length < 4) continue
    if (['sweet', 'savoury', 'sour', 'fun', 'novelty', 'note'].some((w) => name === w)) continue
    const isKnown = productNames.some((pn) => pn.includes(name) || name.includes(pn))
    if (!isKnown) {
      issues.push(`Unknown product: "${match.replace(/\*\*/g, '')}"`)
    }
  }

  const status = issues.length === 0 ? 'PASS' : 'FLAG'
  return { status, issues, mentionedProducts, matchedPrices }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', response.status, err)
      return res.status(502).json({ error: 'Failed to get response from AI' })
    }

    const data = await response.json()
    const reply = data.content[0].text

    const report = validateResponse(reply, products)
    const finalReply = report.status === 'PASS' ? reply : FALLBACK_REPLY

    res.json({ reply: finalReply })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
