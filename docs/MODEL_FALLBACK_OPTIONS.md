# Model Fallback Options
## For Vyasad4s / Bhakti-Daily Work
**Created:** April 23, 2026  
**Context:** Kimi K2.5 on NVIDIA API expires end of April 2026

---

## Current Configuration
**Primary:** `nvidia/moonshotai/kimi-k2.5`  
**Status:** ✅ Active until ~April 30, 2026  
**Strengths:** Excellent Sanskrit handling, long-form theology, step-by-step reasoning

---

## NVIDIA API (integrate.api.nvidia.com/v1)

### 🔥 **RECOMMENDED PRIMARY FALLBACKS**

| Model ID | Provider | Parameters | Context | Free Tier | Best For |
|----------|----------|------------|---------|-----------|----------|
| `deepseek-ai/deepseek-v3.2` | DeepSeek | ~670B | 128K | 10M tokens/month | Sanskrit, long-form commentary |
| `deepseek-ai/deepseek-v3.1-terminus` | DeepSeek | ~671B | 128K | 10M tokens/month | Complex reasoning |
| `deepseek-ai/deepseek-coder-6.7b-instruct` | DeepSeek | 6.7B | 128K | 10M tokens/month | Code (not for Vyasad4s) |
| `nvidia/llama-3.3-nemotron-super-49b-v1` | NVIDIA | 49B | 128K | Varies | Solid general purpose |
| `nvidia/llama-3.3-nemotron-super-49b-v1.5` | NVIDIA | 49B | 128K | Varies | Improved version |
| `nvidia/nemotron-4-340b-instruct` | NVIDIA | 340B | 128K | Limited | Massive context |

### **GOOD SECONDARY OPTIONS**

| Model ID | Provider | Notes |
|----------|----------|-------|
| `mistralai/mistral-large-3-675b-instruct-2512` | Mistral | Massive 675B, excellent quality |
| `mistralai/mistral-large-2-instruct` | Mistral | 100B+, solid reasoning |
| `mistralai/mixtral-8x22b-instruct-v0.1` | Mistral | 22B active, 141B total |
| `meta/llama-3.3-70b-instruct` | Meta | Reliable workhorse |
| `meta/llama-3.2-90b-vision-instruct` | Meta | Vision + text, 90B |
| `meta/llama-3.1-405b-instruct` | Meta | Full 405B if available |

### **OPTIONAL**

| Model ID | Provider | Use Case |
|----------|----------|----------|
| `google/gemma-3-27b-it` | Google | Lightweight fallback |
| `google/gemma-3-12b-it` | Google | Faster, smaller |
| `openai/gpt-oss-120b` | OpenAI | Experimental, rates may apply |
| `openai/gpt-oss-20b` | OpenAI | Smaller, faster |
| `qwen/qwen3-coder-480b-a35b-instruct` | Qwen | Alibaba, good reasoning |
| `qwen/qwen3-next-80b-a3b-instruct` | Qwen | 80B MoE |
| `microsoft/phi-4-multimodal-instruct` | Microsoft | Small but capable |

---

## Cloudflare Workers AI (workers.cloudflare.com)
**Base URL:** `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/`

| Model | Size | Free Requests | Best For |
|-------|------|---------------|----------|
| `@cf/meta/llama-3.2-3b-instruct` | 3B | 10K/day | Lightweight tasks |
| `@cf/meta/llama-3.2-1b-instruct` | 1B | 10K/day | Speed, low-latency |
| `@cf/meta/llama-3.1-8b-instruct` | 8B | 10K/day | Balanced |
| `@cf/mistral/mistral-7b-instruct-v0.1` | 7B | 10K/day | General use |
| `@cf/mistral/mixtral-8x7b-instruct-v0.1` | 8x7B | 10K/day | Better reasoning |

⚠️ **Not suitable for Vyasad4s:** Too small for Sanskrit/long-form work

---

## Direct API Providers (Non-NVIDIA)

### **DeepSeek API** (platform.deepseek.com)
- **Endpoint:** `https://api.deepseek.com/v1`
- **Models:**
  - `deepseek-chat` (DeepSeek-V3)
  - `deepseek-reasoner` (DeepSeek-R1)
- **Free Tier:** 10M tokens/day
- **Rate:** 60 req/min
- **Best for:** Sanskrit, reasoning, theology

### **Google Gemini API** (ai.google.dev)
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta`
- **Models:**
  - `gemini-2.0-flash` — FAST, 1M context
  - `gemini-2.0-pro` — Quality, reasoning
  - `gemini-1.5-flash` — Reliable, fast
- **Free Tier:** 60 req/min, 1,500 req/day
- **Best for:** Reliability, speed, long context

### **Groq** (groq.com)
- **Endpoint:** `https://api.groq.com/openai/v1`
- **Models:**
  - `llama-3.3-70b-versatile`
  - `llama-3.1-8b-instant`
  - `mixtral-8x7b-32768`
- **Free Tier:** $200 credit on signup
- **Rate:** 20 req/sec, 1M tokens/day
- **Best for:** SPEED (absurdly fast)

### **OpenRouter** (openrouter.ai)
- **Endpoint:** `https://openrouter.ai/api/v1`
- **Multiple providers aggregated**
- **Free Tier:** 20 req/min, 200/day
- **Best for:** Testing different models

### **Together AI** (together.ai)
- **Models:** Llama 3, Mixtral, Qwen
- **Free Tier:** Limited, pay-as-you-go
- **Best for:** Llama 3.1 405B full

---

## OpenClaw Configuration Format

```yaml
# ~/.openclaw/config/agent.yml
agents:
  main:
    # Primary (until end of April)
    model: nvidia/moonshotai/kimi-k2.5
    baseUrl: https://integrate.api.nvidia.com/v1
    apiKey: ${NVIDIA_API_KEY}
    
    # Fallback chain
    fallbacks:
      # Option 1: DeepSeek via NVIDIA
      - model: nvidia/deepseek-ai/deepseek-v3.2
        baseUrl: https://integrate.api.nvidia.com/v1
        apiKey: ${NVIDIA_API_KEY}
      
      # Option 2: DeepSeek direct
      - model: deepseek-chat
        baseUrl: https://api.deepseek.com/v1
        apiKey: ${DEEPSEEK_API_KEY}
      
      # Option 3: Gemini
      - model: gemini-2.0-flash
        baseUrl: https://generativelanguage.googleapis.com/v1beta
        apiKey: ${GEMINI_API_KEY}
      
      # Option 4: NVIDIA Nemotron
      - model: nvidia/nemotron-4-340b-instruct
        baseUrl: https://integrate.api.nvidia.com/v1
        apiKey: ${NVIDIA_API_KEY}
```

---

## Quick Decision Matrix

| If you need... | Use this | Provider |
|----------------|----------|----------|
| **Sanskrit precision** | DeepSeek-V3 | NVIDIA or Direct |
| **Step-by-step reasoning** | DeepSeek-R1 | NVIDIA or Direct |
| **Reliability above all** | Gemini 2.0 Flash | Google Direct |
| **Speed (heartbeat tasks)** | Llama 3.3 70B | Groq |
| **Long context (128K+)** | Nemotron 340B | NVIDIA |
| **Free tier that lasts** | DeepSeek | Direct API |

---

## API Key Setup Commands

```bash
# Store in OpenClaw
openclaw configure --section nvidia
# Enter API key when prompted

openclaw configure --section deepseek
# Enter DeepSeek key

openclaw configure --section gemini
# Enter Gemini key

# Verify
openclaw config show
```

---

## Testing Commands

```bash
# Test DeepSeek
openclaw agent run --model deepseek-ai/deepseek-v3.2 --provider nvidia "Hare Krishna"

# Test Gemini
openclaw agent run --model gemini-2.0-flash --provider gemini "Hare Krishna"

# Test Groq
openclaw agent run --model llama-3.3-70b-versatile --provider groq "Hare Krishna"
```

---

## Notes

- **DeepSeek-V3** is the closest functional match to Kimi K2.5
- **Gemini 2.0 Flash** is the fastest (crucial for heartbeat tasks)
- **NVIDIA API** has the most models but rate limits can be strict on free tier
- **DeepSeek direct** has generous free tier but may have downtime
- **Groq** is absurdly fast but costs $ after initial credits

---

**Recommendation:** Set up **DeepSeek-V3 via NVIDIA** as primary fallback, **Gemini Flash** as backup. Keep Kimi K2.5 until it dies, then switch seamlessly.

**Haribol!** 🏹
