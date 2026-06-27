import { createClient } from '@sanity/client'

// Same public, non-secret identifiers as sanity.config.ts.
const projectId = 'g80rrv8s'
const dataset = 'production'
const apiVersion = '2026-01-01'

const writeToken = process.env.SANITY_WRITE_TOKEN
if (!writeToken) {
  console.error('seed-content: SANITY_WRITE_TOKEN is required (set it in .env)')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false })

let keyCounter = 0
function key() {
  keyCounter += 1
  return `k${keyCounter}`
}

function p(text: string) {
  return {
    _type: 'block' as const,
    _key: key(),
    style: 'normal' as const,
    markDefs: [],
    children: [{ _type: 'span' as const, _key: key(), text, marks: [] }],
  }
}

function h2(text: string) {
  return {
    _type: 'block' as const,
    _key: key(),
    style: 'h2' as const,
    markDefs: [],
    children: [{ _type: 'span' as const, _key: key(), text, marks: [] }],
  }
}

function bullet(text: string) {
  return {
    _type: 'block' as const,
    _key: key(),
    style: 'normal' as const,
    listItem: 'bullet' as const,
    level: 1,
    markDefs: [],
    children: [{ _type: 'span' as const, _key: key(), text, marks: [] }],
  }
}

const levels = [
  { key: 'beginner', order: 1, title: 'Beginner', description: "New to using AI day to day — you've tried a chat assistant, maybe autocomplete." },
  { key: 'intermediate', order: 2, title: 'Intermediate', description: 'Comfortable with AI tools, ready to use them for real, multi-step work.' },
  { key: 'advanced', order: 3, title: 'Advanced', description: 'Building workflows around AI and thinking critically about its limits.' },
  { key: 'professional', order: 4, title: 'Professional', description: 'Shipping AI-assisted work at production scale, with guardrails.' },
]

const roles = [
  { key: 'developer', order: 1, title: 'Developer', description: 'Writing application code day to day.' },
  { key: 'software-engineer', order: 2, title: 'Software Engineer', description: 'Designing systems, not just writing code.' },
  { key: 'devops', order: 3, title: 'DevOps / SRE', description: 'Running infrastructure, deploys, and incidents.' },
]

const topics = [
  { key: 'types-of-ai', order: 1, title: 'Types of AI', description: 'The different kinds of AI tools you actually run into.' },
  { key: 'agentic-ai', order: 2, title: 'Agentic AI', description: 'AI that takes multi-step action on your behalf, not just chat.' },
  { key: 'tools', order: 3, title: 'Tools', description: 'Concrete tools and how to use them well.' },
  { key: 'pitfalls', order: 4, title: 'Pitfalls', description: 'Where AI-assisted work goes wrong, and how to avoid it.' },
]

const author = {
  _id: 'author-honecraft-team',
  _type: 'author',
  name: 'Honecraft Team',
  slug: { _type: 'slug', current: 'honecraft-team' },
  bio: 'Writing Honecraft — a practical guide to using AI as a developer, software engineer, and DevOps in 2026.',
}

interface ArticleSeed {
  slug: string
  title: string
  excerpt: string
  level: string
  roles: Array<string>
  topics: Array<string>
  readingTime: number
  body: Array<unknown>
}

const articles: Array<ArticleSeed> = [
  {
    slug: 'types-of-ai-you-will-actually-use',
    title: "Types of AI you'll actually use in 2026",
    excerpt:
      "Chatbots, copilots, agents, and everything in between — a working map of the AI tools you'll run into, so the vocabulary stops getting in your way.",
    level: 'beginner',
    roles: ['developer', 'software-engineer', 'devops'],
    topics: ['types-of-ai'],
    readingTime: 6,
    body: [
      p(
        '"AI" has become a word that means almost nothing on its own — it covers a chat window, an autocomplete suggestion, and a system that can rewrite your codebase overnight. Before any of the rest of this guide is useful, it helps to have a working map of what you actually run into day to day.',
      ),
      h2('Conversational assistants'),
      p(
        'The plain chat interface — ask a question, get an answer in the same window. Useful for explaining a stack trace, drafting a commit message, or thinking through a design out loud. The defining trait: you read every response and decide what to do with it. Nothing happens until you act.',
      ),
      h2('Inline copilots'),
      p(
        "These live where you already work — your editor, your terminal — and suggest the next few lines or the next command as you type. They're fast and low-friction precisely because they stay narrow: one suggestion, one acceptance, repeat. Good for momentum, bad at anything that needs a plan.",
      ),
      h2('Agentic AI'),
      p(
        'The newest category, and the one this guide spends the most time on: AI that plans a sequence of steps and executes them — reading files, running commands, writing code, checking the result, and adjusting — with you reviewing the outcome rather than every keystroke. The shift is from "suggests text" to "takes action." We unpack this properly in the next article.',
      ),
      h2('Specialized models'),
      p(
        "Not everything is a general-purpose chat model. Code-search models, embedding models for retrieval, and fine-tuned classifiers all show up inside tools you use without necessarily seeing the model directly — a smart search bar, an anomaly detector in your monitoring dashboard, a PR-review bot.",
      ),
      h2('Why the distinction matters'),
      bullet('Conversational tools need you to bring the context and ask the right question.'),
      bullet('Copilots need you to stay in the loop, line by line.'),
      bullet('Agentic tools need you to set boundaries up front, then review outcomes, not keystrokes.'),
      p(
        "Most of the friction people describe with \"AI\" is actually a mismatch — using a chat assistant for a multi-step task it was never built to track, or handing an agent something open-ended with no guardrails. Knowing which kind of tool you're holding is most of the battle.",
      ),
    ],
  },
  {
    slug: 'what-is-agentic-ai-really',
    title: 'What is agentic AI, really?',
    excerpt:
      "Past the buzzword: what makes an AI system \"agentic,\" what it can and can't do unsupervised, and the mental model that keeps you from over- or under-trusting it.",
    level: 'beginner',
    roles: ['developer', 'software-engineer', 'devops'],
    topics: ['agentic-ai'],
    readingTime: 7,
    body: [
      p(
        '"Agentic" gets used for everything from a chatbot with a few extra buttons to a system that can spend an hour rewriting a service unsupervised. The useful definition is narrower: an agentic system observes the state of something (a codebase, a terminal, a ticket queue), decides on a next action, takes it, and looks at the result before deciding again — in a loop, without you approving each individual step.',
      ),
      h2('The loop is the whole idea'),
      p(
        "Compare it to a single autocomplete suggestion: that's one prediction, shown once, accepted or rejected once. An agent instead runs a cycle — plan, act, observe, replan — for as many iterations as the task needs. That loop is what lets it open a file, notice a failing test, fix it, rerun the tests, and stop only once they pass.",
      ),
      h2("What it's good at"),
      bullet('Tasks with a clear, checkable end state — "tests pass," "the build succeeds," "the lint errors are gone."'),
      bullet('Mechanical, well-scoped multi-step work — a rename across a codebase, a dependency bump and the resulting fixups.'),
      bullet('First-draft exploration — scaffolding a new service, drafting a migration plan you will edit.'),
      h2("What it's bad at"),
      bullet('Tasks where "done" is a judgment call, not a check — most product and design decisions.'),
      bullet('Anything where a wrong intermediate step is expensive and hard to detect automatically.'),
      bullet('Long-running unsupervised work with no checkpoint for you to look at the result.'),
      h2('The mental model that helps'),
      p(
        'Treat an agent like a capable but literal-minded junior engineer working alone overnight: give it a specific, checkable goal and the access it needs to verify its own work, then review the diff in the morning. Don\'t give it your whole inbox and a vague "make things better." The skill this guide is really teaching is scoping — turning fuzzy goals into the kind of bounded, checkable task an agent loop can actually run with.',
      ),
    ],
  },
  {
    slug: 'first-ai-pair-programming-session',
    title: 'Your first AI pair-programming session',
    excerpt:
      "A concrete walkthrough of working with an AI coding assistant on a real, small task — what to type, what to check, and the habits that make the difference.",
    level: 'beginner',
    roles: ['developer'],
    topics: ['tools'],
    readingTime: 6,
    body: [
      p(
        "Most guides to AI coding tools start with features. This one starts with a session — a small, realistic task, worked end to end, so the habits that matter are visible in context rather than listed in the abstract.",
      ),
      h2('Pick a task with a clear finish line'),
      p(
        'A good first task is small and checkable: add input validation to a form handler, write tests for an existing function, fix a specific bug with a reproducible failure. Avoid "refactor this module" as a first task — there\'s no clear definition of done, so you can\'t tell if the assistant actually helped.',
      ),
      h2('Give it the context it needs, not everything you have'),
      p(
        "Paste in the function and its tests, not the whole file, and definitely not the whole repo, unless the tool can read the repo itself. State the constraint explicitly — \"keep the existing function signature\" — rather than assuming it's obvious. Vague prompts get vague code; specific constraints get code you can actually use.",
      ),
      h2('Read the diff like a PR, not like an oracle'),
      bullet('Does it handle the edge case you actually care about, or just the happy path?'),
      bullet('Did it introduce a dependency or pattern that doesn\'t match the rest of the codebase?'),
      bullet('Can you explain what every line does? If not, ask before you merge it.'),
      h2('Iterate in small corrections'),
      p(
        'If the first answer is close but wrong, say specifically what\'s wrong rather than re-describing the whole task — "this throws on an empty array, handle that case" gets a faster, more precise fix than starting over. Treat the conversation as a working session, not a vending machine.',
      ),
      h2('The habit that compounds'),
      p(
        "Keep your own tests and types tight. An assistant that's checked against a strict type signature and a real test suite catches its own mistakes; one working against loose, untyped code will confidently hand you bugs. The better your guardrails, the more useful the assistant becomes — which is really the theme of this whole guide.",
      ),
    ],
  },
  {
    slug: 'agentic-workflows-for-software-engineers',
    title: 'Agentic workflows for software engineers: planning, review, and refactors',
    excerpt:
      "Three concrete workflows where an agent loop earns its keep for software engineers — and the checkpoints that keep each one safe to run unsupervised.",
    level: 'intermediate',
    roles: ['software-engineer'],
    topics: ['agentic-ai', 'tools'],
    readingTime: 8,
    body: [
      p(
        'Once you trust the basic agent loop — plan, act, observe, replan — the question becomes where to point it. Three workflows consistently earn back the setup time for software engineers: planning, code review, and large mechanical refactors.',
      ),
      h2('Planning: turning a ticket into a plan you can critique'),
      p(
        'Before any code gets written, ask an agent to read the relevant files and propose a plan — which files change, in what order, what the risk points are — without writing the implementation yet. A plan is cheap to read and cheap to redirect; code is not. This single step catches most of the "agent went off in a weird direction" problems before they cost you anything.',
      ),
      h2('Review: a second pass before a human one'),
      bullet('Run an agent over your own diff before opening the PR — it catches inconsistent naming, missed error handling, and forgotten tests reliably.'),
      bullet('Ask it to check the diff against your team\'s actual conventions (paste the style guide or point it at a reference file), not generic best practices.'),
      bullet('Use it to draft the PR description from the diff — accurate, fast, and it forces you to re-read your own changes.'),
      h2('Refactors: where the agent loop genuinely outperforms manual work'),
      p(
        "Large, mechanical refactors — renaming a widely-used function, migrating off a deprecated API across forty call sites — are exactly the checkable, repetitive work an agent loop handles well: change a call site, run the build, fix what broke, repeat. Set the loop a hard stop condition (\"the build is green and the test suite passes\") and let it run, then review the full diff at the end rather than each step.",
      ),
      h2('The checkpoint that matters most'),
      p(
        "For all three, the safe pattern is the same: let the agent run to a checkable state, then review the result yourself before it goes further — into a PR, into the next phase of the plan, into a merge. The risk in agentic workflows isn't the individual step; it's compounding unreviewed steps until the diff is too large to meaningfully check.",
      ),
    ],
  },
  {
    slug: 'using-ai-agents-safely-in-devops',
    title: 'Using AI agents safely in DevOps: deploys, infra-as-code, and guardrails',
    excerpt:
      "Agentic AI can write infra changes, draft runbooks, and triage incidents — but the blast radius of a mistake is higher in DevOps than almost anywhere else. Here's how to use it without losing sleep.",
    level: 'intermediate',
    roles: ['devops'],
    topics: ['agentic-ai', 'tools', 'pitfalls'],
    readingTime: 8,
    body: [
      p(
        "Nowhere does \"review the result, not every step\" matter more than infrastructure. A bad refactor breaks a build; a bad infra change can take down production. Agentic AI is genuinely useful in DevOps — but the guardrails have to be tighter than anywhere else in this guide.",
      ),
      h2('Where it earns its keep'),
      bullet('Drafting infra-as-code changes (Terraform, Kubernetes manifests) from a description — then reviewed and planned, never applied, by the agent itself.'),
      bullet('Summarizing an incident timeline from logs and alerts into a draft postmortem you edit, not publish directly.'),
      bullet('Triage: correlating an alert with recent deploys and config changes to suggest — not execute — a likely cause.'),
      h2('The rule: plan, don\'t apply'),
      p(
        'For anything that touches real infrastructure, the agent\'s job ends at producing a plan — a `terraform plan` diff, a draft PR, a proposed kubectl command — never an applied change. This is the same plan/apply separation that good infra practice already uses for human changes; it doesn\'t go away because AI wrote the diff. If your pipeline can\'t produce a dry-run plan for a given change, that\'s a sign the change isn\'t safe to automate yet, AI or not.',
      ),
      h2('Scope access tightly'),
      p(
        "Whatever credentials an agent runs with should be scoped to exactly what the task needs — a read-only cloud role for triage, a plan-only role for infra changes — the same least-privilege thinking you'd apply to a new hire's first week, not a senior engineer's full access.",
      ),
      h2('Pitfalls specific to this domain'),
      bullet('Confidently wrong root-cause analysis — an agent will produce a plausible-sounding cause even from incomplete logs. Treat it as a hypothesis, not a finding.'),
      bullet('Config drift — an AI-drafted change that "looks right" but doesn\'t match the actual current state of a long-lived resource. Always plan against current state, never assume it.'),
      bullet('Alert fatigue in reverse — over-trusting an agent\'s triage and skipping your own check on a page that turns out to matter.'),
      p(
        'None of this means avoiding agentic tools in DevOps — it means keeping the same separation between proposing and applying that already exists in mature infra practice, and making sure AI sits firmly on the "proposing" side of that line.',
      ),
    ],
  },
  {
    slug: 'common-pitfalls-adopting-ai-tools',
    title: 'Common pitfalls when adopting AI tools — and how to avoid them',
    excerpt:
      "The recurring ways teams get burned adopting AI tools — overtrust, under-scoping, and skipped review — and the concrete habits that prevent each one.",
    level: 'advanced',
    roles: ['developer', 'software-engineer', 'devops'],
    topics: ['pitfalls'],
    readingTime: 7,
    body: [
      p(
        "Most of the bad outcomes from AI-assisted work trace back to a small set of repeated mistakes, not exotic model failures. Naming them precisely is most of the fix.",
      ),
      h2('Overtrust: treating fluent output as correct output'),
      p(
        'Confident, well-formatted, plausible-sounding output is not the same as correct output — and AI is unusually good at the former regardless of the latter. The fix isn\'t skepticism for its own sake; it\'s routing every AI output through the same check you\'d apply to a colleague\'s work: can you verify this independently — a test, a build, a second source — before it ships?',
      ),
      h2('Under-scoping: vague tasks produce vague, unreviewable results'),
      p(
        '"Make this better" or "modernize this codebase" gives an agent loop nothing to check itself against, which means it makes a large number of unreviewable judgment calls on your behalf. The fix is the same scoping discipline from earlier in this guide — a specific, checkable goal, reviewed at a defined checkpoint — applied as a habit, not a one-off.',
      ),
      h2('Skipped review: letting diff size outpace your ability to check it'),
      p(
        "Agentic tools make it easy to generate a large diff fast, and easy to fall behind on actually reading it. If a change is too large to review properly, that's a sign to split the task and add a checkpoint, not a sign to skip the review because the tool seems trustworthy this time.",
      ),
      h2('Context rot: feeding stale or wrong information'),
      bullet('Pointing an assistant at outdated docs or a stale style guide produces confidently wrong output.'),
      bullet('Reusing a long conversation past the point where its context is still accurate compounds small errors.'),
      bullet('The fix: keep the reference material you hand to AI tools current, and start fresh when the task changes meaningfully.'),
      h2('The habit underneath all of these'),
      p(
        "Every pitfall above is a version of the same thing: treating AI output as a finished answer instead of a fast first draft that still needs the judgment a human brings. Teams that adopt AI tools well haven't found a way around review — they've gotten faster at it.",
      ),
    ],
  },
]

async function main() {
  console.log('seed-content: writing taxonomy terms...')
  for (const term of levels) {
    await client.createOrReplace({
      _id: `level-${term.key}`,
      _type: 'level',
      key: term.key,
      slug: { _type: 'slug', current: term.key },
      order: term.order,
      title: { en: term.title },
      description: { en: term.description },
    })
  }
  for (const term of roles) {
    await client.createOrReplace({
      _id: `role-${term.key}`,
      _type: 'role',
      key: term.key,
      slug: { _type: 'slug', current: term.key },
      order: term.order,
      title: { en: term.title },
      description: { en: term.description },
    })
  }
  for (const term of topics) {
    await client.createOrReplace({
      _id: `topic-${term.key}`,
      _type: 'topic',
      key: term.key,
      slug: { _type: 'slug', current: term.key },
      order: term.order,
      title: { en: term.title },
      description: { en: term.description },
    })
  }

  console.log('seed-content: writing author...')
  await client.createOrReplace(author)

  console.log('seed-content: writing articles...')
  for (const article of articles) {
    await client.createOrReplace({
      _id: `article-${article.slug}`,
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      excerpt: article.excerpt,
      body: article.body,
      readingTime: article.readingTime,
      language: 'en',
      translationStatus: 'human',
      author: { _type: 'reference', _ref: author._id },
      level: { _type: 'reference', _ref: `level-${article.level}` },
      roles: article.roles.map((roleKey) => ({
        _type: 'reference',
        _ref: `role-${roleKey}`,
        _key: key(),
      })),
      topics: article.topics.map((topicKey) => ({
        _type: 'reference',
        _ref: `topic-${topicKey}`,
        _key: key(),
      })),
    })
    console.log(`  - ${article.title}`)
  }

  console.log(`seed-content: done (${articles.length} articles, ${levels.length + roles.length + topics.length} taxonomy terms)`)
}

main().catch((error) => {
  console.error('seed-content: failed', error)
  process.exit(1)
})
