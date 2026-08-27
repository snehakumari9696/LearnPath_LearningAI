import { FlashcardDeck } from '../types';

export const curatedFlashcardDecks: FlashcardDeck[] = [
  {
    id: 'deck-ai-core',
    title: 'Generative AI & LLM Architecture',
    skill: 'AI Engineering',
    topic: 'LLM Foundations & Transformers',
    description: 'Master attention mechanisms, tokenization, RoPE positional embeddings, and quantization.',
    cardsCount: 6,
    cards: [
      {
        id: 'fc-1',
        topic: 'Self-Attention Mechanism',
        front: 'What is the core mathematical role of Scaled Dot-Product Attention in Transformers?',
        back: 'Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V. It calculates dynamic pairwise relevance scores between every token in a sequence, allowing tokens to selectively route contextual information across the entire context window.',
        analogy: 'Imagine a cocktail party where every guest (token) asks everyone else "How relevant is your conversation to mine?" and focuses their hearing on the most relevant speakers.',
        codeSnippet: `// Scaled dot-product attention in PyTorch
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(d_k, dtype=torch.float32))
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    attn_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attn_weights, V), attn_weights`,
        codeLanguage: 'python',
        keyTakeaways: [
          'Dividing by sqrt(d_k) prevents softmax gradient vanishing at large dimensions.',
          'Time complexity is O(N^2) relative to sequence length N.',
          'Multi-head attention projects into multiple subspaces simultaneously.'
        ],
        interviewTip: 'Always mention quadratic complexity O(N^2) and mention FlashAttention v2 as the modern GPU SRAM optimization used in production.',
        difficulty: 'Intermediate',
        masteryStatus: 'learning'
      },
      {
        id: 'fc-2',
        topic: 'Retrieval-Augmented Generation (RAG)',
        front: 'How does Hybrid Search (Dense + Sparse) improve RAG retrieval recall?',
        back: 'Dense search (vector embeddings via Cosine/HNSW) captures semantic meaning and conceptual synonyms, while Sparse search (BM25/SPLADE) captures exact keyword matches like error codes, part numbers, and proper nouns. Reciprocal Rank Fusion (RRF) combines both rankings for superior retrieval accuracy.',
        analogy: 'Dense search is like asking a librarian "find books about star exploration", while Sparse search is searching the card catalog for the exact ISBN "0-306-40615-2". Together you get both broad insight and exact precision.',
        codeSnippet: `// Reciprocal Rank Fusion (RRF) algorithm
function rrfScore(rankDense: number, rankSparse: number, k = 60): number {
  return (1 / (k + rankDense)) + (1 / (k + rankSparse));
}`,
        codeLanguage: 'typescript',
        keyTakeaways: [
          'Dense handles semantic queries and multi-lingual nuances.',
          'Sparse handles domain-specific jargon, codes, and names.',
          'Re-ranking models (Cohere Rerank, BGE) score the top candidates.'
        ],
        interviewTip: 'Highlight Chunking Strategy (semantic vs fixed with overlap) and Metadata Filtering before vector distance evaluation.',
        difficulty: 'Intermediate',
        masteryStatus: 'unseen'
      },
      {
        id: 'fc-3',
        topic: 'Model Quantization (GGUF, AWQ, GPTQ)',
        front: 'What is the trade-off between Post-Training Quantization (PTQ) from FP16 to INT4 / INT8?',
        back: 'Quantization reduces the bit-precision of model weights (e.g. from 16-bit floating point to 4-bit integers), slashing VRAM requirements by ~75% and speeding up memory-bound GPU inference, with minor perplexity loss when using activation-aware methods like AWQ.',
        analogy: 'Downsampling a 4K raw video to high-efficiency 1080p: the human eye (output quality) barely notices a difference, but the file size and streaming bandwidth drop drastically.',
        codeSnippet: `# Loading a model in 4-bit using bitsandbytes
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B", quantization_config=bnb_config)`,
        codeLanguage: 'python',
        keyTakeaways: [
          'Reduces VRAM so an 8B model fits into 6GB VRAM instead of 16GB.',
          'Memory bandwidth is the primary bottleneck for autoregressive LLM decoding.',
          'AWQ (Activation-aware Weight Quantization) protects critical outlier weights.'
        ],
        interviewTip: 'Differentiate between weight-only quantization and weight+activation quantization (SmoothQuant).',
        difficulty: 'Advanced',
        masteryStatus: 'unseen'
      },
      {
        id: 'fc-4',
        topic: 'Fine-Tuning with LoRA & QLoRA',
        front: 'How does Low-Rank Adaptation (LoRA) freeze foundation models while enabling efficient parameter tuning?',
        back: 'Instead of updating the full weight matrix W (d x k), LoRA decomposes the weight update delta into two low-rank matrices: delta_W = B * A, where B is (d x r) and A is (r x k) with rank r << min(d, k). This reduces trainable parameters by >99%.',
        analogy: 'Rather than rewriting an entire encyclopedia from scratch, you append a thin 5-page addendum bookmark with specific amendments.',
        codeSnippet: `from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=16, # Rank
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
peft_model = get_peft_model(base_model, lora_config)`,
        codeLanguage: 'python',
        keyTakeaways: [
          'Drastically reduces GPU training memory and adapter checkpoint sizes (e.g. 50MB vs 16GB).',
          'Enables serving hundreds of customized domain adapters from a single shared base model.',
          'Rank r between 8 and 64 is typically optimal for instruction tuning.'
        ],
        interviewTip: 'Explain how LoRA matrices can be merged back into the base weights during production deployment for zero inference latency overhead.',
        difficulty: 'Advanced',
        masteryStatus: 'unseen'
      },
      {
        id: 'fc-5',
        topic: 'Function Calling & Tool Use',
        front: 'How do LLMs execute deterministic tools and structured API calls?',
        back: 'The client provides JSON schema definitions of tools. The model is trained to output structured arguments conforming to the schema instead of freeform prose when a tool call is needed. The host application executes the tool and passes the output back into the conversation context.',
        analogy: 'A chef (LLM) who realizes an ingredient is missing doesn\'t manufacture it themselves; they write a purchase order ticket (JSON tool call) for the kitchen runner (backend server) to fetch from the pantry.',
        codeSnippet: `// Gemini Tool Declaration Schema
const tools = [{
  functionDeclarations: [{
    name: "fetchStockPrice",
    description: "Get real-time stock quotes",
    parameters: {
      type: "OBJECT",
      properties: {
        ticker: { type: "STRING", description: "Stock symbol e.g. GOOGL" }
      },
      required: ["ticker"]
    }
  }]
}];`,
        codeLanguage: 'typescript',
        keyTakeaways: [
          'Separates stochastic language reasoning from deterministic business computation.',
          'Model predicts the JSON function call, client executes it safely.',
          'Enables multi-turn agentic loops (ReAct framework).'
        ],
        interviewTip: 'Emphasize security sandboxing and never running eval() or raw SQL generated directly by LLMs without server-side parameterization.',
        difficulty: 'Intermediate',
        masteryStatus: 'mastered'
      },
      {
        id: 'fc-6',
        topic: 'Temperature & Top-p (Nucleus) Sampling',
        front: 'What is the mathematical difference between Temperature and Top-p (Nucleus) decoding?',
        back: 'Temperature scales the raw logits before softmax (T < 1.0 sharpens probabilities towards greedy top choices; T > 1.0 flattens distribution for creativity). Top-p restricts the sampling candidate pool to the smallest set of tokens whose cumulative probability exceeds threshold p (e.g. 0.9).',
        analogy: 'Temperature adjusts the intensity of the oven (hotter = more random bubbles). Top-p sets a velvet rope at a club that only admits the top 90% VIP tokens and turns away the bottom 10% absurd tokens.',
        codeSnippet: `// Logit temperature scaling formula:
// P(token_i) = exp(logit_i / Temperature) / sum_j(exp(logit_j / Temperature))`,
        codeLanguage: 'typescript',
        keyTakeaways: [
          'Temperature 0 or near 0 is best for coding, math, and JSON extraction.',
          'Top-p cuts off the long tail of low-probability hallucinated tokens.',
          'Combining both provides balanced creativity and syntactic coherence.'
        ],
        interviewTip: 'For production JSON API endpoints, recommend Temperature 0.2 and structured JSON schemas with responseMimeType="application/json".',
        difficulty: 'Beginner',
        masteryStatus: 'learning'
      }
    ]
  },
  {
    id: 'deck-fullstack-ts',
    title: 'Full-Stack TypeScript & React 19',
    skill: 'Full-Stack Web Development',
    topic: 'React Internals, Server Components & Node.js',
    description: 'Master React Fiber reconciliation, concurrent rendering, Server Actions, and Node event loop.',
    cardsCount: 4,
    cards: [
      {
        id: 'fc-fs-1',
        topic: 'React Reconciliation & Fiber Tree',
        front: 'How does React Fiber enable cooperative multitasking and interruptible rendering?',
        back: 'React Fiber represents the component tree as a linked list of fibers (work units). During the Render phase (which is pure and interruptible), React computes virtual DOM diffs in chunks using requestIdleCallback/MessageChannel. The Commit phase applies DOM mutations synchronously.',
        analogy: 'Instead of cooking a 10-course banquet all in one unbroken marathon (blocking the kitchen), the chef slices one carrot, checks if an urgent VIP order arrived, handles the urgent order, then resumes slicing carrots.',
        codeSnippet: `// Conceptual Fiber Node Structure
interface FiberNode {
  tag: WorkTag;
  key: null | string;
  type: any;
  child: FiberNode | null;
  sibling: FiberNode | null;
  return: FiberNode | null; // parent fiber
  pendingProps: any;
  memoizedState: any;
}`,
        codeLanguage: 'typescript',
        keyTakeaways: [
          'Render phase can be paused, aborted, or restarted without DOM side effects.',
          'Commit phase is synchronous and applies changes to the actual DOM.',
          'Powers Concurrent Features like useTransition and Suspense.'
        ],
        interviewTip: 'Explain why keys in lists prevent entire DOM subtrees from being destroyed and remounted during reconciliation.',
        difficulty: 'Intermediate',
        masteryStatus: 'unseen'
      },
      {
        id: 'fc-fs-2',
        topic: 'Node.js Event Loop & Microtasks',
        front: 'In what exact execution order does Node.js process Microtasks vs Macrotasks?',
        back: 'Microtask queues (process.nextTick, Promise.then, queueMicrotask) are drained immediately after every synchronous JavaScript turn and between each phase of the Event Loop (Timers, Pending I/O, Poll, Check/setImmediate, Close). process.nextTick runs before Promise microtasks.',
        analogy: 'Microtasks are like people with "FastPass VIP priority" who jump to the front of the line the instant the current person steps off the ride, before the regular queue moves forward.',
        codeSnippet: `console.log('1'); // Sync
setTimeout(() => console.log('2'), 0); // Timer Macrotask
Promise.resolve().then(() => console.log('3')); // Microtask
process.nextTick(() => console.log('4')); // nextTick Microtask
console.log('5'); // Sync
// Output: 1, 5, 4, 3, 2`,
        codeLanguage: 'typescript',
        keyTakeaways: [
          'process.nextTick priority over Promise microtasks.',
          'SetImmediate runs in the Check phase right after I/O polling.',
          'Long microtask chains can starve the I/O event loop.'
        ],
        interviewTip: 'Use this classic execution sequence example to prove your deep understanding of asynchronous JavaScript runtime concurrency.',
        difficulty: 'Intermediate',
        masteryStatus: 'unseen'
      }
    ]
  },
  {
    id: 'deck-sysdesign',
    title: 'Distributed Systems & Scalability',
    skill: 'System Design',
    topic: 'Caching, Sharding, CAP Theorem & Eventual Consistency',
    description: 'Core architectural patterns for high-throughput, low-latency microservices and database clustering.',
    cardsCount: 4,
    cards: [
      {
        id: 'fc-sd-1',
        topic: 'Cache Invalidation Strategies',
        front: 'Compare Cache-Aside, Write-Through, and Write-Behind caching patterns.',
        back: 'In Cache-Aside, the app reads from cache; on miss, reads from DB and updates cache. In Write-Through, writes update cache and DB synchronously. In Write-Behind (Write-Back), writes update cache immediately and asynchronously batch-flush to DB for ultra-low write latency.',
        analogy: 'Cache-aside is looking in your desk drawer for a notebook; if missing, walking to the warehouse. Write-behind is jotting a quick note on a sticky pad and having an assistant file it in the filing cabinet later.',
        codeSnippet: `// Cache-Aside Pattern Implementation
async function getUser(id: string): Promise<User> {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.users.findById(id);
  if (user) {
    await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user));
  }
  return user;
}`,
        codeLanguage: 'typescript',
        keyTakeaways: [
          'Cache-Aside is resilient to cache crashes (fallback to DB).',
          'Write-Behind provides highest write throughput at the risk of data loss on crash.',
          'Set appropriate TTLs to prevent stale cache drift.'
        ],
        interviewTip: 'Always discuss the Thundering Herd / Cache Stampede problem and solve it with probabilistic early expiration (XFetch) or mutex locking.',
        difficulty: 'Advanced',
        masteryStatus: 'unseen'
      }
    ]
  }
];
