import { createClient } from '@sanity/client'

// Same public, non-secret identifiers as sanity.config.ts.
const projectId = 'g80rrv8s'
const dataset = 'production'
const apiVersion = '2026-01-01'

const writeToken = process.env.SANITY_WRITE_TOKEN
if (!writeToken) {
  console.error('seed-claude-code-path: SANITY_WRITE_TOKEN is required (set it in .env)')
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

function code(text: string, language = 'bash') {
  return {
    _type: 'code' as const,
    _key: key(),
    language,
    code: text,
  }
}

const author = { _type: 'reference' as const, _ref: 'author-honecraft-team' }

interface LessonSeed {
  slug: string
  level: string
  title: string
  excerpt: string
  readingTime: number
  body: Array<unknown>
}

// ---------------------------------------------------------------------------
// English lessons
// ---------------------------------------------------------------------------

const lessonsEn: Array<LessonSeed> = [
  {
    slug: 'claude-code-getting-started',
    level: 'beginner',
    title: 'Getting started with Claude Code',
    excerpt:
      "What Claude Code actually is, how to install it, and what your first real session looks like — from opening a terminal to your first reviewed edit.",
    readingTime: 7,
    body: [
      p(
        "Claude Code is Claude running inside your terminal, with direct access to your project's files, your shell, and (with your permission) the internet. Instead of copy-pasting code into a chat window, you point it at a real project and ask for what you want — \"add a dark mode toggle,\" \"why is this test failing,\" \"set up a GitHub Actions workflow\" — and it reads the relevant files, makes the change, and shows you a diff before anything is final.",
      ),
      h2('Installing it'),
      p(
        'Claude Code installs as a small CLI. The exact command can change as the tool evolves, so check the official docs for the current install method — but the shape of it is always the same: install once globally, then run it from inside any project folder.',
      ),
      code('npm install -g @anthropic-ai/claude-code'),
      p('Once installed, open a terminal, move into a project, and start it:'),
      code('cd my-project\nclaude'),
      h2('Your first session'),
      p(
        "You'll land in an interactive prompt. Type in plain English what you want — there's no special syntax to learn for a first request. A few good starting points if you want to get a feel for it without touching real work yet:",
      ),
      bullet('"Explain what this project does and how it\'s structured."'),
      bullet('"Are there any obvious bugs in this file?"'),
      bullet('"Write a few tests for this function."'),
      p(
        "Claude reads the files it needs (you don't have to paste code in) and replies with both an explanation and, if you asked for a change, the actual edit.",
      ),
      h2('How permission works'),
      p(
        "Claude Code doesn't silently rewrite your project. Before it edits a file or runs a command that could matter, it shows you exactly what it wants to do and asks for confirmation — a permission prompt. You can approve once, approve for the rest of the session, or deny it and explain what you'd rather it do instead. This is the core safety mechanism: you stay the one who decides what actually happens to your code.",
      ),
      h2('Reading the diff'),
      p(
        "When Claude edits a file, you see a diff — the exact lines added and removed — before or as it happens, depending on your settings. Reading these diffs is the single most valuable habit you can build as a beginner. Don't just trust that it worked; skim what changed the same way you'd skim a teammate's pull request.",
      ),
      h2('A realistic first task'),
      p(
        "Once you're comfortable, try something with a clear, checkable outcome: \"the build is failing, find out why and fix it,\" or \"add input validation to the signup form.\" Tasks with an obvious definition of done — a passing build, a passing test — are the easiest place to start trusting an agent's judgment, because you can verify the result yourself in seconds.",
      ),
      h2('What to do if something looks wrong'),
      p(
        "If a proposed edit looks off, say so directly — \"that's not what I meant, revert that and try again, but only touch the validation function.\" Claude Code is conversational: correcting course mid-task is normal and expected, not a failure state. Nothing is permanent until you've approved it, and even approved changes are just normal file edits you can undo with git like any other.",
      ),
    ],
  },
  {
    slug: 'claude-surfaces-which-one-for-what',
    level: 'beginner',
    title: 'Claude Code, claude.ai, Desktop app, Chrome extension: which one for what',
    excerpt:
      "Four different places to talk to Claude, each built for a different job. A practical decision guide so you stop reaching for the wrong one.",
    readingTime: 6,
    body: [
      p(
        "\"Claude\" isn't one app — it's the same underlying model available through several different surfaces, each shaped around a different kind of work. Picking the right one matters more than people expect: the wrong surface either can't do what you need, or makes an easy task needlessly slow.",
      ),
      h2('claude.ai — the chat assistant'),
      p(
        "The plain web (and mobile) chat interface. No access to your files or your computer by default. Best for: drafting and editing text, thinking through a problem out loud, asking general questions, working with Projects (a persistent set of files and instructions you reuse across chats) and Artifacts (a separate panel for documents, code snippets, or small interactive demos it builds for you). If the task lives entirely inside the conversation, this is the right place.",
      ),
      h2('Claude Code — the terminal agent'),
      p(
        "Runs in your terminal or IDE, inside a real project, with direct file and shell access. Built specifically for software engineering work: reading a codebase, making multi-file changes, running tests, fixing a failing build, writing a migration. If the task is \"do something to this code\" rather than \"talk to me about this idea,\" this is the tool.",
      ),
      h2('Claude Desktop app — your computer, supervised'),
      p(
        "A desktop application that, with permission, can see your screen and control your mouse and keyboard inside other apps — computer use — and connect to outside tools (Slack, Gmail, your calendar, Linear, and others) through MCP connectors. It's the right choice when the task spans native apps that don't have files or an API you can script against: \"reorganize my Notes app,\" \"go through these emails and flag the urgent ones,\" \"update this spreadsheet I have open.\"",
      ),
      h2('Claude in Chrome — the browser extension'),
      p(
        "Lives inside Chrome and can read, click, and type on actual web pages on your behalf — filling out a form, gathering information across several tabs, testing a flow on your own site. Where the Desktop app's reach is your whole operating system, the Chrome extension's reach is specifically the browser, and it's the better fit when the task is fundamentally \"do this on a website.\"",
      ),
      h2('A quick decision guide'),
      bullet('Drafting an email or talking through a decision — claude.ai.'),
      bullet('Refactoring code, fixing a bug, writing a script — Claude Code.'),
      bullet('Organizing files, controlling a native app, working across email/calendar/chat tools — Desktop app.'),
      bullet('Filling a form, researching across browser tabs, testing your own web app — Chrome extension.'),
      h2("They're not mutually exclusive"),
      p(
        "Plenty of real workflows use more than one: draft a plan in claude.ai, hand the implementation to Claude Code, then use the Chrome extension to manually verify the deployed result in a browser. Think of them as different hands for different jobs, not competing products you have to pick one of forever.",
      ),
    ],
  },
  {
    slug: 'claude-code-everyday-workflow',
    level: 'beginner',
    title: 'The everyday Claude Code workflow',
    excerpt:
      'Reading, editing, running commands, reviewing diffs, and undoing mistakes — the small habits that make day-to-day work with an agent smooth instead of stressful.',
    readingTime: 7,
    body: [
      p(
        "Once the novelty wears off, day-to-day work with Claude Code comes down to a handful of repeated motions. Getting comfortable with them is what turns it from a curiosity into a tool you reach for automatically.",
      ),
      h2('Start specific, not vague'),
      p(
        '"Fix the bug" produces worse results than "the /checkout endpoint returns a 500 when the cart is empty — find out why and fix it." You don\'t need to write a spec, but naming the symptom, the location, and what "fixed" looks like saves several rounds of back-and-forth.',
      ),
      h2('Let it read before it writes'),
      p(
        "A good agent investigates before changing anything — searching for the relevant files, reading how similar code is already written in your project, checking how a function is used elsewhere before changing its signature. If a response jumps straight to an edit on a non-trivial request without explaining what it found, it's reasonable to ask it to explain its reasoning first.",
      ),
      h2('Review diffs like a colleague’s pull request'),
      p(
        "This is the habit that matters most. Skim every diff before approving: does it touch only what you'd expect, does it match how the rest of the codebase is written, did it leave anything half-finished. You're not re-deriving the whole solution — you're doing the same sanity check you'd do on a teammate's PR.",
      ),
      h2('Run the checks yourself, or ask it to'),
      bullet('Ask Claude Code to run the test suite, the linter, or a type checker after a change.'),
      bullet('A task with a checkable end state ("tests pass") is far easier to trust than one that ends in a judgment call.'),
      bullet("If there's no automated check, say what you'll verify manually so you both know what \"done\" means."),
      h2('Correcting course mid-task'),
      p(
        'It\'s normal to interrupt and redirect: "stop, that\'s the wrong file" or "good, but also update the tests" or "actually, revert the last change and try a simpler approach." Treat it like a conversation with a capable but literal collaborator — say exactly what you want changed about its approach, not just that something feels off.',
      ),
      h2('Undoing things'),
      p(
        "Nothing Claude Code does is more permanent than a normal file edit. If a change turns out to be wrong after the fact, git is still your safety net — diff it, revert it, or check out the previous version exactly as you would for any change, agent-written or not.",
      ),
      h2('Closing a task well'),
      p(
        "Before moving on, a quick \"summarize what changed and why\" is worth the ten seconds it costs — it doubles as a commit message draft and as your own final sanity check that the change does what you think it does.",
      ),
    ],
  },
  {
    slug: 'claude-code-memory-explained',
    level: 'intermediate',
    title: 'Claude Code memory, explained',
    excerpt:
      "How CLAUDE.md files give Claude Code lasting context about you and your project, what belongs in them, and what to leave out.",
    readingTime: 7,
    body: [
      p(
        "Every new chat starts from zero — except it doesn't have to. Claude Code can read persistent memory files at the start of a session, so it already knows your conventions, your stack, and your preferences before you've typed a single message. That memory mechanism is just a plain text file: CLAUDE.md.",
      ),
      h2('Two scopes: global and project'),
      p(
        "A global CLAUDE.md (in your home directory) applies to every project you open — good for things true about you regardless of what you're working on: your commit message format, your general workflow preferences, recurring tools you use. A project-level CLAUDE.md (at the root of a repo) applies only there — the project's architecture, its specific conventions, decisions the team has already made and doesn't want re-litigated.",
      ),
      h2('What belongs in memory'),
      bullet('Conventions that aren\'t obvious from the code: "always use named exports," "tests live next to the file they test."'),
      bullet('Standing instructions you\'d otherwise repeat every session: a commit message format, a deploy checklist.'),
      bullet('Context that explains "why," not "what" — a workaround for a quirky dependency, a deliberate architectural choice that looks odd without the backstory.'),
      bullet('Corrections you\'ve had to make more than once: if you\'ve told it the same thing twice, that\'s a sign it belongs in memory instead of being retyped a third time.'),
      h2("What doesn't belong"),
      bullet("Anything derivable by reading the code — file structure, what a function does, the tech stack. That goes stale and Claude can just look.") ,
      bullet('Secrets, credentials, or anything sensitive — memory files are plain text and often get committed to git.'),
      bullet('Long, in-progress task notes. That\'s what a plan or a todo list inside the current session is for, not permanent memory.'),
      h2('Keeping it useful, not bloated'),
      p(
        "Memory that's too long stops being read carefully, by you or by Claude. Periodically revisit a CLAUDE.md the way you'd revisit any document — remove what's no longer true, tighten what's vague, and split it into sections if it's grown unwieldy. A short, accurate file beats a long, stale one every time.",
      ),
      h2('A minimal example'),
      code(
        '# Commit messages\nUse Conventional Commits: type(scope): summary.\n\n# Testing\nRun `pnpm test` before considering any change done.\nNever skip a failing test to make a deadline -- fix it or flag it.\n\n# Code style\nPrefer named exports. No default exports in this repo.',
        'markdown',
      ),
      h2('Memory is a starting point, not a leash'),
      p(
        "Think of CLAUDE.md as onboarding notes for a sharp new teammate, not a rulebook to be followed blindly. It saves you from repeating yourself, and it gives Claude Code the same shared context any human collaborator would want on day one.",
      ),
    ],
  },
  {
    slug: 'claude-code-skills-and-slash-commands',
    level: 'intermediate',
    title: 'Skills and slash commands',
    excerpt:
      "Memory tells Claude facts about your project. Skills give it reusable procedures — named, repeatable workflows you can trigger with a single command.",
    readingTime: 6,
    body: [
      p(
        'Memory (CLAUDE.md) answers "what does Claude need to know about this project." Skills answer a different question: "what does Claude need to know how to do, the same way, every time." A skill is a named, reusable procedure — written once, triggered with a slash command like /code-review or /deploy-checklist — instead of re-explaining the same multi-step process in every conversation.',
      ),
      h2('A simple example'),
      p(
        "Say you always want the same checklist before deploying: check tests pass, check the migration is reversible, check the feature flag is wired up, check the rollback plan is written down. Typing that out every time is tedious and easy to shorten by accident under pressure. A skill captures it once; running /deploy-checklist runs through all of it, every time, the same way.",
      ),
      h2('Skills vs. just asking'),
      p(
        "For a one-off request, just ask in plain language — that's still the most direct path for anything you won't repeat. Skills earn their place when a task recurs: a process you run before every release, a specific review checklist, a standard way you want a particular kind of bug investigated. If you've typed out the same multi-step instructions three times, it's probably worth turning into a skill.",
      ),
      h2('How a skill is structured'),
      p(
        'At its core, a skill is a short instruction file with a clear trigger description (so Claude knows when to use it) and the steps or guidance to follow. Keep it focused on one job — a skill that tries to do five unrelated things is harder to trust and harder to trigger correctly than five small, clear ones.',
      ),
      h2('Building your own'),
      p(
        "Start from a real, repeated pain point rather than designing skills speculatively. Notice yourself giving the same multi-step instructions more than once, write down exactly what you did and in what order, and turn that into a skill with a description specific enough that it triggers on the right requests and not on unrelated ones.",
      ),
      h2('Where this fits with agents and memory'),
      p(
        "Memory, skills, and agents solve three different problems: memory is standing context, skills are repeatable procedures, and agents (covered later in this path) are about delegating an entire piece of work to a separate Claude instance. A mature setup usually uses all three — memory for the facts that don't change often, skills for the workflows you run repeatedly, and agents for work substantial enough to hand off wholesale.",
      ),
    ],
  },
  {
    slug: 'claude-desktop-computer-use-and-mcp',
    level: 'intermediate',
    title: 'Claude Desktop app: computer use and MCP connectors',
    excerpt:
      "What the Desktop app adds beyond chat: supervised control of your screen for native apps, and MCP connectors that link Claude to the tools you already use.",
    readingTime: 7,
    body: [
      p(
        "The Claude Desktop app starts as a chat window like claude.ai, but it can do two things a browser tab can't: see and operate your screen, and connect directly to other applications through MCP. Together, these turn it from \"a place to ask questions\" into \"a hand you can lend your computer to, briefly and on your terms.\"",
      ),
      h2('Computer use'),
      p(
        "With your explicit permission, Claude can take screenshots of your desktop and act on what it sees — clicking, typing, scrolling — inside native apps that don't expose a file or an API to work with directly: a settings panel, a desktop Notes app, a legacy piece of software with no automation hooks. This is genuinely useful for exactly that gap, and genuinely the wrong tool for anything that has a cleaner option (a real file, a real API, a terminal command) available instead.",
      ),
      h2('Permission tiers'),
      p(
        "Not every app gets the same level of access. Browsers are typically read-only — visible so Claude can see context, but clicks and typing are blocked, with real navigation handled by a browser extension instead. Terminals and IDEs are often click-only — you can bring a window forward or click a button, but typing and key presses stay blocked. Everything else can be granted full control. This tiering exists specifically so a moment of overreach in a sensitive app fails safely instead of silently succeeding.",
      ),
      h2('MCP connectors'),
      p(
        "MCP (Model Context Protocol) is how Claude connects to outside tools with structured, authenticated access — your email, calendar, Slack, a project tracker like Linear — instead of clicking around their interfaces. A connected tool gives Claude real, scoped actions (\"create this calendar event,\" \"search these messages\") rather than pixel-guessing on a screenshot, which makes it both more reliable and easier to reason about what it's allowed to do.",
      ),
      h2('When to reach for this vs. Claude Code'),
      bullet('A task confined to files, a terminal, and a codebase — Claude Code is built for exactly that and will be faster and more reliable.'),
      bullet('A task that spans native apps, your desktop environment, or services only reachable through MCP — the Desktop app is the right reach.'),
      bullet("Both can be right for a larger workflow: code in Claude Code, then update a tracked ticket or notify a channel through an MCP connector in the Desktop app."),
      h2('A safety habit worth keeping'),
      p(
        "Treat links inside emails, messages, or documents the way you'd treat them yourself: suspicious by default. Verify the real destination before letting any agent follow one, and never let computer use complete a financial transaction unsupervised — placing an order, sending money, executing a trade. Those stay actions a human takes, on purpose, every time.",
      ),
    ],
  },
  {
    slug: 'claude-code-agents-and-subagents',
    level: 'advanced',
    title: 'Agents and subagents: when to delegate, how to brief them well',
    excerpt:
      "A subagent is a separate Claude instance you spawn for a piece of work. Knowing when to delegate to one — and how to brief it like a capable colleague — is what separates basic and advanced usage.",
    readingTime: 8,
    body: [
      p(
        "So far, this path has been about one Claude instance working alongside you in one conversation. A subagent is different: a separate instance, with its own context window, spawned to handle a self-contained piece of work and report back a result — rather than you walking through every step of it yourself.",
      ),
      h2('Why delegate at all'),
      bullet('Parallelism — independent pieces of research or work can run at the same time instead of one after another.'),
      bullet('Context protection — a subagent can read through a huge log file or a sprawling search and hand back just the three lines that matter, instead of all that noise filling up your main conversation.'),
      bullet('Focus — a subagent given one narrow job tends to do it more reliably than a single instance juggling many things at once.'),
      h2('When not to bother'),
      p(
        "Delegation has overhead: a fresh subagent has no memory of your conversation so far, so briefing it well takes real effort, and spinning one up for a two-line answer often costs more than it saves. If you already know exactly what file to look at, just look — or ask directly in your current conversation. Reserve subagents for work that's genuinely substantial, independent, or would otherwise flood your main context with detail you don't need to see.",
      ),
      h2('Briefing a subagent like a smart colleague'),
      p(
        "A subagent starts cold: it hasn't seen your conversation, doesn't know what you've already tried, and doesn't know why the task matters. A good brief includes the goal, the relevant background you've already worked out, enough context to make judgment calls rather than just following a narrow instruction, and — if you need it — how long the response should be.",
      ),
      h2('Two ways to phrase a task'),
      bullet('Lookups: hand over the exact thing to check — a command to run, a specific file to read. There\'s one right answer; don\'t make the subagent guess at the method.'),
      bullet("Investigations: hand over the question, not a prescribed list of steps. If you over-specify \"how,\" a wrong assumption baked into your steps becomes a wrong assumption baked into the result."),
      h2('A worked example'),
      p(
        'Weak brief: "check the database." Strong brief: "We\'re deciding whether a migration that adds a NOT NULL column to a 50-million-row table with a backfill default is safe under concurrent writes. I\'ve already checked basic locking behavior. I want an independent read on whether the backfill approach itself is safe — and if not, what specifically breaks. Answer in under 200 words."',
      ),
      h2('Reading back the result'),
      p(
        "A subagent's summary describes what it intended to do, not necessarily everything it actually did — the same way you'd treat a colleague's status update as a starting point, not a substitute for looking at the actual diff or output when the stakes are real. Trust, but verify, especially before acting on a recommendation rather than just learning from it.",
      ),
      h2('Multiple agents, one task'),
      p(
        "Independent subtasks with no dependency between them — researching three unrelated libraries, reviewing two unrelated files — can be delegated to several subagents at once rather than one after another. The moment one piece of work depends on the result of another, that parallelism has to stop; sequence them instead of guessing at an answer that isn't ready yet.",
      ),
    ],
  },
  {
    slug: 'claude-in-chrome-safe-web-automation',
    level: 'advanced',
    title: 'Claude in Chrome: safe web automation',
    excerpt:
      "The Chrome extension lets Claude read, click, and type on real web pages on your behalf. What it's genuinely good for, and the safety habits worth keeping non-negotiable.",
    readingTime: 7,
    body: [
      p(
        "The Claude in Chrome extension gives Claude eyes and hands inside your browser: it can read a page's content, click links and buttons, fill in forms, and move between tabs — all the things you'd do manually, but described in plain language instead of clicked one at a time.",
      ),
      h2('What it\'s genuinely good for'),
      bullet('Repetitive form-filling across many similar records — the kind of task that\'s tedious precisely because it\'s mechanical.'),
      bullet('Gathering information spread across several tabs and bringing it back together in one place.'),
      bullet('Exercising your own web app the way a real user would, as a manual sanity check after a change.'),
      h2('Where it gets risky'),
      p(
        "Anything involving money or irreversible actions deserves a human hand, every time: placing an order, sending a payment, submitting something that can't be retracted. The extension is built to let you click through those steps yourself rather than complete them unsupervised, and that boundary is worth respecting deliberately, not treating as a limitation to route around.",
      ),
      h2('Link safety, specifically'),
      p(
        "Links inside emails, chat messages, or pages from unfamiliar sources are suspicious by default — the visible text of a link can say one thing while the actual destination is something else entirely. Before following an unfamiliar link, the real URL should be checked, not assumed from the link text. If a destination looks even slightly off, that's worth confirming with a person before continuing, not pushing through.",
      ),
      h2('Giving it a task well'),
      p(
        'Say what outcome you want and any constraints that matter, rather than narrating individual clicks: "go through this list of addresses and fill in the shipping form for each one, using the default options unless a field is required" is a complete brief. Micromanaging every click defeats the point of automating the task at all.',
      ),
      h2('Staying in the loop on longer tasks'),
      p(
        "For anything beyond a couple of steps, checking in partway through — does the data look right so far, did it land on the page you expected — costs little and catches problems while they're still cheap to fix, rather than after twenty records have been filled out the same wrong way.",
      ),
    ],
  },
  {
    slug: 'claude-code-plan-mode-worktrees-hooks-at-scale',
    level: 'professional',
    title: 'Plan mode, worktrees, hooks, and running Claude safely at scale',
    excerpt:
      'The professional layer: exploring safely before committing to changes, running parallel agent work without collisions, automating policy with hooks, and the team habits that make this sustainable.',
    readingTime: 9,
    body: [
      p(
        "Everything so far has been about a single session on a single task. Using Claude Code professionally — across a team, across many tasks a day, on production systems — adds a layer of process on top: ways to explore safely, run work in parallel without collisions, enforce policy automatically, and keep changes reviewable at the speed they're produced.",
      ),
      h2('Plan mode: look before you commit'),
      p(
        "For anything non-trivial, it's worth separating \"figure out the approach\" from \"make the change.\" Plan mode does exactly that — Claude investigates and proposes an approach without editing anything, you review and adjust the plan itself, and only once you approve does it move to actually making changes. This catches a wrong approach while it's still just a paragraph of text, not a pile of edits to unwind.",
      ),
      h2('Worktrees: parallel work without collisions'),
      p(
        "Git worktrees let you check out more than one branch of the same repository into separate folders at once. For agent work, that means you can run Claude Code on two unrelated tasks simultaneously — a bug fix in one worktree, a feature in another — without either one's in-progress edits interfering with the other's, and without constantly switching branches back and forth in a single folder.",
      ),
      code('git worktree add ../my-project-fix-123 -b fix-123\ncd ../my-project-fix-123\nclaude'),
      h2('Hooks: automating policy, not judgment'),
      p(
        "Hooks run a shell command automatically in response to events — before a tool runs, after a session ends, and similar triggers. They're the right place for policy you never want skipped: always run the linter after a file edit, always block a command on a denylist, always notify a channel when a long task finishes. Keep hooks mechanical and deterministic; anything that needs judgment belongs in the conversation, not a hook.",
      ),
      h2('Permission modes, deliberately chosen'),
      p(
        "How much Claude Code can do without asking is a dial, not a single on/off switch — from approving every single action to running more autonomously inside guardrails you've set in advance. Match the mode to the blast radius of the work: tight permissions for anything touching production or shared infrastructure, looser permissions for low-stakes, easily-reverted local work where slowing down to confirm every step adds friction without adding safety.",
      ),
      h2('Team conventions worth writing down'),
      bullet('A shared, project-level CLAUDE.md so every team member\'s sessions start from the same baseline context.'),
      bullet('A clear line on what always gets human review before merging, regardless of who — or what — wrote it.'),
      bullet('Agreement on what hooks enforce automatically vs. what stays a human judgment call in code review.'),
      h2('Safety habits that don\'t go away with experience'),
      bullet("Read the diff. Every time. Especially once it stops feeling necessary -- that's exactly when a real mistake slips through."),
      bullet('Never skip hooks or bypass safety checks (--no-verify and similar) as a shortcut past an inconvenient failure -- fix the underlying issue instead.'),
      bullet('Treat destructive operations -- force pushes, hard resets, dropped tables -- as requiring a deliberate, separate confirmation, never a default.'),
      p(
        "None of this is about distrust. It's the same professional discipline you'd want around any powerful, fast-moving tool — code review, staged rollouts, clear ownership — applied to a collaborator that happens to be an AI instead of a junior engineer. The tasks get bigger and the leverage gets real; the verification habits are what make that leverage safe to use.",
      ),
    ],
  },
]

// ---------------------------------------------------------------------------
// Burmese lessons -- original drafts (not machine-translated), same slugs as
// their English counterparts so the locale-fallback in getArticleBySlug /
// getLearningPathBySlug resolves them correctly. Marked machine-draft for
// human review in Studio before publishing.
// ---------------------------------------------------------------------------

const lessonsMy: Array<LessonSeed> = [
  {
    slug: 'claude-code-getting-started',
    level: 'beginner',
    title: 'Claude Code ကို စတင်အသုံးပြုခြင်း',
    excerpt:
      'Claude Code ဆိုတာ ဘာလဲ၊ ဘယ်လို install လုပ်မလဲ၊ ပထမဆုံး session တစ်ခုက ဘယ်လိုဖြစ်မလဲ — terminal ဖွင့်ကတည်းက ပထမဆုံး edit ကို review လုပ်တဲ့အထိ။',
    readingTime: 7,
    body: [
      p(
        'Claude Code ဆိုတာ Claude ကို သင့် terminal ထဲမှာ run လို့ရတဲ့ပုံစံပါ — သင့် project ရဲ့ file တွေ၊ shell ကို တိုက်ရိုက် access လုပ်နိုင်ပြီး (သင့် ခွင့်ပြုချက်နဲ့) internet ကိုပါ ချိတ်ဆက်နိုင်တယ်။ Code ကို chat window ထဲ copy-paste လုပ်ဖို့ မလိုဘဲ၊ project အစစ်ကို ညွှန်ပြပြီး သင်လိုချင်တာကို တောင်းဆိုလို့ရတယ် — "dark mode toggle တစ်ခု ထည့်ပေး"၊ "ဒီ test ဘာကြောင့် fail ဖြစ်နေတာလဲ"၊ "GitHub Actions workflow တစ်ခု setup လုပ်ပေး" — ပြီးတော့ relevant ဖြစ်တဲ့ file တွေကို ဖတ်ပြီး ပြင်ဆင်မှုကို လုပ်ပေးတယ်၊ ဘာမှ အပြီးသတ် မဖြစ်ခင် diff တစ်ခု ပြပေးတယ်။',
      ),
      h2('Install လုပ်ခြင်း'),
      p(
        'Claude Code ကို သေးငယ်တဲ့ CLI တစ်ခုအနေနဲ့ install လုပ်ရတယ်။ tool ဖွံ့ဖြိုးလာတာနဲ့အမျှ install command အတိအကျ ပြောင်းလဲနိုင်တဲ့အတွက် official docs ကို စစ်ဆေးကြည့်ပါ — ဒါပေမယ့် ပုံစံကတော့ အမြဲတမ်း တူတယ်: တစ်ခါတည်း global အနေနဲ့ install လုပ်ပြီး project folder ထဲက run ရင် ရတယ်။',
      ),
      code('npm install -g @anthropic-ai/claude-code'),
      p('Install ပြီးရင် terminal ဖွင့်ပြီး project ထဲ ဝင်ပြီး စလို့ရတယ်:'),
      code('cd my-project\nclaude'),
      h2('ပထမဆုံး Session'),
      p(
        'Interactive prompt တစ်ခုကို တွေ့ရလိမ့်မယ်။ သင်လိုချင်တာကို ရိုးရှင်းတဲ့ English နဲ့ ရိုက်ထည့်လိုက်ပါ — ပထမဆုံး request အတွက် သီးခြား syntax သင်စရာ မလိုပါ။ အလုပ်အစစ်ကို မထိခင် feel လေးခံစားကြည့်ချင်ရင် စတင်ကောင်းမယ့် နမူနာအချို့:',
      ),
      bullet('"ဒီ project က ဘာလုပ်တာလဲ၊ structure ဘယ်လိုလဲ ရှင်းပြပါ။"'),
      bullet('"ဒီ file ထဲမှာ ထင်ရှားတဲ့ bug တွေ ရှိလားဆိုတာ စစ်ပေးပါ။"'),
      bullet('"ဒီ function အတွက် test အချို့ ရေးပေးပါ။"'),
      p(
        'Claude က လိုအပ်တဲ့ file တွေကို ဖတ်တယ် (code ကို paste လုပ်စရာ မလိုပါ) ပြီး ရှင်းပြချက်တစ်ခုနဲ့ အတူ၊ ပြောင်းလဲမှု တောင်းဆိုထားရင် actual edit ကိုပါ ပြန်ဖြေပေးတယ်။',
      ),
      h2('ခွင့်ပြုချက် (Permission) ဘယ်လို အလုပ်လုပ်သလဲ'),
      p(
        'Claude Code က သင့် project ကို တိတ်တဆိတ် ပြန်ရေးတာ မလုပ်ပါ။ ဂရုစိုက်ရမယ့် file တစ်ခုကို edit လုပ်ခင် ဒါမှမဟုတ် command run ခင်၊ ဘာလုပ်ချင်တယ်ဆိုတာ အတိအကျ ပြပြီး confirmation တောင်းတယ် — permission prompt တစ်ခု။ တစ်ခါတည်း approve လုပ်လို့ရတယ်၊ session ကျန်တဲ့အချိန်လုံး approve လုပ်လို့ရတယ်၊ ဒါမှမဟုတ် ငြင်းပြီး ဘာလုပ်စေချင်တယ်ဆိုတာ ရှင်းပြလို့ရတယ်။ ဒါက core safety mechanism ပါ — သင့် code ကို ဘာဖြစ်စေချင်တယ်ဆိုတာ ဆုံးဖြတ်သူက သင်ပဲ ဖြစ်နေအောင် ထိန်းပေးတယ်။',
      ),
      h2('Diff ကို ဖတ်ခြင်း'),
      p(
        'Claude က file တစ်ခုကို edit လုပ်တဲ့အခါ၊ ဖြစ်ပျက်ခင် (ဒါမှမဟုတ် ဖြစ်ပျက်နေစဉ်၊ သင့် setting အပေါ် မူတည်) diff တစ်ခု — ထည့်လိုက်တဲ့ နှင့် ဖြုတ်လိုက်တဲ့ line အတိအကျ — ကို မြင်ရလိမ့်မယ်။ ဒီ diff တွေကို ဖတ်တတ်တဲ့ အလေ့အကျင့်က beginner တစ်ယောက်အတွက် တန်ဖိုးအရှိဆုံး habit ပါ။ အလုပ်ပြီးပြီလို့ ယုံကြည်ရုံတင် မနေပါနဲ့ — colleague ရဲ့ pull request ကို ကြည့်သလိုမျိုး ဘာပြောင်းလဲသွားလဲ မြန်မြန် ကြည့်ပါ။',
      ),
      h2('လက်တွေ့ ပထမဆုံး Task'),
      p(
        'အဆင်ပြေသွားပြီဆိုရင်၊ ရှင်းလင်းပြီး စစ်ဆေးနိုင်တဲ့ outcome ရှိတဲ့ အရာတစ်ခုကို စမ်းကြည့်ပါ: "build fail ဖြစ်နေတယ်၊ ဘာကြောင့်လဲ ရှာပြီး ပြင်ပေး" ဒါမှမဟုတ် "signup form ကို input validation ထည့်ပေး" လိုမျိုး။ ရှင်းလင်းတဲ့ done definition ရှိတဲ့ task တွေ — build pass ဖြစ်ခြင်း၊ test pass ဖြစ်ခြင်း — က agent ရဲ့ ဆုံးဖြတ်ချက်ကို ယုံကြည်စရာ အလွယ်ဆုံး starting point ဖြစ်တယ်၊ ဘာကြောင့်လဲဆိုတော့ result ကို စက္ကန့်ပိုင်းအတွင်း သင်ကိုယ်တိုင် verify လုပ်နိုင်လို့ပါ။',
      ),
      h2('တစ်ခုခု မှားယွင်းနေပုံပေါ်ရင်'),
      p(
        'Edit တင်ပြထားတာ မှားယွင်းနေပုံပေါ်ရင် တိုက်ရိုက် ပြောပါ — "ဒါ မဟုတ်ပါ၊ ဒါကို ပြန် revert လုပ်ပြီး ထပ်ကြိုးစားပါ၊ ဒါပေမယ့် validation function ကိုပဲ ထိပါ" လိုမျိုး။ Claude Code က စကားပြောဆိုနိုင်တဲ့ tool ပါ — task တစ်ခု အလုပ်လုပ်နေစဉ် လမ်းကြောင်း ပြန်ပြင်တာက ပုံမှန်အရာပါ၊ မအောင်မြင်ခြင်း မဟုတ်ပါ။ သင် approve မလုပ်မချင်း ဘာမှ အပြီးသတ် မဖြစ်ပါ၊ approve လုပ်ပြီးတဲ့ ပြောင်းလဲမှုတောင် git နဲ့ အခြား file edit တိုင်းလိုပဲ undo လုပ်နိုင်ပါတယ်။',
      ),
    ],
  },
  {
    slug: 'claude-surfaces-which-one-for-what',
    level: 'beginner',
    title: 'Claude Code, claude.ai, Desktop app, Chrome extension — ဘယ်အချိန် ဘာကို သုံးမလဲ',
    excerpt:
      'Claude ကို ပြောဆိုနိုင်တဲ့ နေရာလေးခု — တစ်ခုစီက အလုပ်အမျိုးမျိုးအတွက် ဖန်တီးထားတာ။ မှားယွင်းတဲ့ tool ကို မရွေးတော့ဘို့ လက်တွေ့ ဆုံးဖြတ်နည်း guide တစ်ခု။',
    readingTime: 6,
    body: [
      p(
        '"Claude" ဆိုတာ app တစ်ခုတည်း မဟုတ်ပါ — အောက်ခံ model တစ်ခုတည်းကို နေရာအမျိုးမျိုးကနေ ဝင်ရောက်အသုံးပြုနိုင်ပြီး၊ တစ်ခုစီက အလုပ်အမျိုးအစား မတူညီအောင် ပုံစံချထားတာပါ။ မှန်ကန်တဲ့ နေရာကို ရွေးတာက လူတွေ မျှော်လင့်ထားတာထက် ပိုအရေးကြီးတယ် — မှားတဲ့ tool ကို ရွေးမိရင် လိုချင်တာကို မလုပ်ပေးနိုင်ဘူး၊ ဒါမှမဟုတ် လွယ်တဲ့ task ကို လိုအပ်ထက်ပိုပြီး နှေးကွေးအောင် လုပ်တတ်ပါတယ်။',
      ),
      h2('claude.ai — Chat Assistant'),
      p(
        'ရိုးရှင်းတဲ့ web (နဲ့ mobile) chat interface ပါ။ Default အားဖြင့် သင့် file တွေ ဒါမှမဟုတ် computer ကို access လုပ်နိုင်စွမ်း မရှိပါ။ အကောင်းဆုံး အသုံးပြုနိုင်တာတွေက: စာသား draft ရေးခြင်းနဲ့ ပြင်ဆင်ခြင်း၊ ပြဿနာတစ်ခုကို အသံထွက် တွေးခေါ်ခြင်း၊ ယေဘုယျ မေးခွန်းများ မေးခြင်း၊ Projects (chat အများကြီးမှာ ပြန်သုံးနိုင်တဲ့ file နဲ့ instruction အစုအဝေး) နဲ့ Artifacts (document၊ code snippet၊ interactive demo အသေးလေးတွေအတွက် သီးခြား panel) တို့နဲ့ အလုပ်လုပ်ခြင်း။ Task တစ်ခုလုံး conversation အတွင်းမှာပဲ ရှိနေရင် ဒီနေရာက မှန်ကန်ပါတယ်။',
      ),
      h2('Claude Code — Terminal Agent'),
      p(
        'Project အစစ်တစ်ခုအတွင်း သင့် terminal ဒါမှမဟုတ် IDE ထဲမှာ run တယ်၊ file နဲ့ shell ကို တိုက်ရိုက် access ရတယ်။ Software engineering အလုပ်အတွက် တိတိကျကျ တည်ဆောက်ထားတာပါ: codebase ဖတ်ခြင်း၊ file များစွာကို ပြောင်းလဲခြင်း၊ test run ခြင်း၊ fail ဖြစ်နေတဲ့ build ပြင်ခြင်း၊ migration ရေးခြင်း။ Task က "ဒီ idea အကြောင်း ပြောကြည့်ပါ" မဟုတ်ဘဲ "ဒီ code ကို တစ်ခုခု လုပ်ပေး" ဆိုရင် ဒါက မှန်ကန်တဲ့ tool ပါ။',
      ),
      h2('Claude Desktop App — ထိန်းချုပ်ထားသော Computer Access'),
      p(
        'Permission ရှိရင် သင့် screen ကို မြင်နိုင်ပြီး app အခြားများထဲမှာ mouse နဲ့ keyboard ကို ထိန်းချုပ်နိုင်တဲ့ desktop application ပါ — computer use လို့ခေါ်တယ် — ပြီးတော့ MCP connectors တွေကနေ ပြင်ပ tool တွေ (Slack, Gmail, calendar, Linear, စသည်) ကို ချိတ်ဆက်နိုင်တယ်။ File ဒါမှမဟုတ် script run လို့ရတဲ့ API မရှိတဲ့ native app တွေပါတဲ့ task အတွက် မှန်ကန်တဲ့ ရွေးချယ်မှု ဖြစ်တယ်: "Notes app ကို ပြန်စီစဉ်ပေး"၊ "ဒီ email တွေ ကြည့်ပြီး urgent ဖြစ်တာတွေ flag လုပ်ပေး"၊ "ဖွင့်ထားတဲ့ ဒီ spreadsheet ကို update လုပ်ပေး" စသည်ဖြင့်။',
      ),
      h2('Claude in Chrome — Browser Extension'),
      p(
        'Chrome ထဲမှာ ရှိနေပြီး web page အစစ်တွေပေါ်မှာ သင့်အစား ဖတ်ခြင်း၊ နှိပ်ခြင်း၊ စာရိုက်ခြင်း လုပ်ပေးနိုင်တယ် — form ဖြည့်ခြင်း၊ tab များစွာကနေ အချက်အလက်စုဆောင်းခြင်း၊ သင့် site ပေါ်က flow ကို test လုပ်ခြင်း။ Desktop app ရဲ့ လက်လှမ်းမှုက operating system တစ်ခုလုံးဖြစ်နေတဲ့နေရာမှာ၊ Chrome extension ရဲ့ လက်လှမ်းမှုက browser ချည်းသာပါ၊ task က "website ပေါ်မှာ ဒါကို လုပ်ပေး" အခြေခံဆိုရင် ဒါက ပိုကိုက်ညီတယ်။',
      ),
      h2('မြန်မြန် ဆုံးဖြတ်ရန် Guide'),
      bullet('Email တစ်စောင် draft ရေးတာ ဒါမှမဟုတ် ဆုံးဖြတ်ချက်တစ်ခု အသံထွက် တွေးတာ — claude.ai။'),
      bullet('Code refactor လုပ်တာ၊ bug ပြင်တာ၊ script ရေးတာ — Claude Code။'),
      bullet('File စီစဉ်တာ၊ native app ကို ထိန်းချုပ်တာ၊ email/calendar/chat tool တွေကြားမှာ အလုပ်လုပ်တာ — Desktop app။'),
      bullet('Form ဖြည့်တာ၊ browser tab တွေကြောင့် research လုပ်တာ၊ သင့် web app ကို test လုပ်တာ — Chrome extension။'),
      h2('တစ်ခုနဲ့တစ်ခု ဆန့်ကျင်နေတာ မဟုတ်ပါ'),
      p(
        'Workflow အစစ်တွေအများစုက တစ်ခုထက်ပို အသုံးပြုကြပါတယ်: claude.ai မှာ plan တစ်ခု draft ရေးပြီး၊ implementation ကို Claude Code ကို လွှဲပေးပြီး၊ နောက်ဆုံး Chrome extension သုံးပြီး deploy ဖြစ်သွားတဲ့ result ကို browser ထဲမှာ manual စစ်ဆေးတယ်။ ဒါတွေကို permanent ရွေးချယ်ထားရမယ့် ပြိုင်ဘက် product တွေအနေနဲ့ မသတ်မှတ်ပါနဲ့၊ အလုပ်အမျိုးမျိုးအတွက် လက်တွေ့ tool အမျိုးမျိုးလို့ပဲ မှတ်ထားပါ။',
      ),
    ],
  },
  {
    slug: 'claude-code-everyday-workflow',
    level: 'beginner',
    title: 'နေ့စဉ် Claude Code အလုပ်လုပ်ပုံ',
    excerpt:
      'ဖတ်ခြင်း၊ ပြင်ဆင်ခြင်း၊ command run ခြင်း၊ diff review ခြင်း၊ မှားယွင်းချက်များကို ပြန်ပြင်ခြင်း — agent နဲ့ နေ့စဉ်အလုပ်လုပ်ရာတွင် စိတ်ပင်ပန်းမှုမရှိအောင် ကူညီပေးတဲ့ အလေ့အကျင့်လေးများ။',
    readingTime: 7,
    body: [
      p(
        'ပထမဆုံး အသစ်ဆန်းမှု ပျောက်သွားပြီးနောက်၊ Claude Code နဲ့ နေ့စဉ် အလုပ်လုပ်ခြင်းဆိုတာ ထပ်ခါထပ်ခါ ဖြစ်ပျက်နေတဲ့ လုပ်ဆောင်ချက် အနည်းငယ်အပေါ် မူတည်ပါတယ်။ ဒါတွေကို ကျွမ်းကျင်လာတာက ဒါကို စိတ်ဝင်စားစရာ tool တစ်ခုကနေ အလိုအလျောက် လှမ်းအသုံးပြုနေတဲ့ tool တစ်ခု ပြောင်းလဲပေးပါတယ်။',
      ),
      h2('တိတိကျကျ စတင်ပါ၊ မထွေပြားအောင်'),
      p(
        '"Bug ကို ပြင်ပေး" ဆိုတာက "/checkout endpoint ကို cart ဗလာဖြစ်နေတဲ့အခါ 500 ပြန်ပေးနေတယ်၊ ဘာကြောင့်လဲ ရှာပြီး ပြင်ပေး" ဆိုတာထက် ပိုဆိုးတဲ့ result ကို ထုတ်ပေးပါလိမ့်မယ်။ Spec တစ်ခုလုံး ရေးစရာ မလိုပေမယ့်၊ symptom၊ နေရာ၊ "ပြင်ပြီးပြီ" ဆိုတာ ဘယ်လို မြင်ရမလဲ ဆိုတာကို နာမည်ပေးထားတာက round-trip အများကြီး ချွေတာပေးနိုင်ပါတယ်။',
      ),
      h2('မရေးခင် ဖတ်ခွင့်ပေးပါ'),
      p(
        'Agent ကောင်းတစ်ခုက ဘာမှ မပြောင်းလဲခင် investigate လုပ်ပါတယ် — relevant file တွေ ရှာတယ်၊ project ထဲက code တူရာတွေ ဘယ်လို ရေးထားလဲ ဖတ်တယ်၊ function တစ်ခုရဲ့ signature ပြောင်းခင် တခြားနေရာတွေမှာ ဘယ်လို သုံးထားလဲ စစ်တယ်။ Non-trivial request တစ်ခုအတွက် response က ဘာတွေ တွေ့ခဲ့သလဲ ရှင်းမပြဘဲ edit တန်းလုပ်ရင်၊ reasoning ကို အရင် ရှင်းပြခိုင်းတာ ကြိုက်ညီတယ်။',
      ),
      h2('Colleague ရဲ့ Pull Request လို Diff ကို Review လုပ်ပါ'),
      p(
        'ဒါက အရေးကြီးဆုံး habit ပါ။ Approve မလုပ်ခင် diff တိုင်းကို မြန်မြန် ကြည့်ပါ: မျှော်လင့်ထားတဲ့ အရာတွေကိုပဲ ထိထားလား၊ codebase ကျန်တဲ့ အပိုင်းတွေနဲ့ style တူလား၊ တစ်ဝက်တစ်ပျက် ကျန်ခဲ့တာ ရှိလား။ Solution တစ်ခုလုံးကို ပြန်ဆင်းခြင်းမဟုတ်ပါ — colleague ရဲ့ PR မှာ လုပ်မယ့် sanity check အတူတူပါပဲ လုပ်နေတာပါ။',
      ),
      h2('Check တွေကို ကိုယ်တိုင် Run ပါ၊ ဒါမှမဟုတ် Run ခိုင်းပါ'),
      bullet('Claude Code ကို test suite, linter, type checker တို့ကို ပြောင်းလဲမှုတစ်ခုပြီးတိုင်း run ခိုင်းပါ။'),
      bullet('Checkable end state ရှိတဲ့ task ("test pass") က judgment call နဲ့ ဆုံးတဲ့ task ထက် ပိုယုံကြည်ရလွယ်တယ်။'),
      bullet('Automated check မရှိရင်၊ manual ဘယ်လို verify လုပ်မယ်ဆိုတာ ပြောထားပါ၊ ဒါမှ "ပြီးပြီ" ဆိုတဲ့ အဓိပ္ပါယ်ကို နှစ်ဦးနှစ်ဖက် နားလည်မှု တူညီမယ်။'),
      h2('Task လုပ်နေစဉ် လမ်းကြောင်း ပြန်ပြင်ခြင်း'),
      p(
        'ရပ်ပြီး ညွှန်ပြခြင်းက ပုံမှန်ပါ: "ရပ်ပါ၊ ဒါက file မှားနေတယ်" ဒါမှမဟုတ် "ကောင်းတယ်၊ ဒါပေမယ့် test တွေကိုပါ update လုပ်ပေး" ဒါမှမဟုတ် "တကယ်တော့၊ နောက်ဆုံး ပြောင်းလဲမှုကို revert လုပ်ပြီး ပိုရိုးရှင်းတဲ့ approach တစ်ခု စမ်းကြည့်ပါ" လိုမျိုး။ Capable ဒါပေမယ့် literal ဖြစ်တဲ့ colleague တစ်ယောက်နဲ့ စကားပြောနေသလို မှတ်ပါ — approach ကို ဘာပြောင်းချင်လဲ အတိအကျ ပြောပါ၊ ဘာမှားနေတယ်လို့ ခံစားရတယ်ဆိုတာထက်။',
      ),
      h2('ပြန်ဖျက်ခြင်း (Undo)'),
      p(
        'Claude Code လုပ်တဲ့ ဘာမှ ရိုးရိုး file edit တစ်ခုထက် ပို permanent မဖြစ်ပါ။ Change တစ်ခု နောက်ပိုင်းမှာ မှားနေတယ်ဆိုရင်လည်း git က သင့် safety net ဆိုတာ ဆက်ဖြစ်နေပါတယ် — diff ကြည့်ပါ၊ revert လုပ်ပါ၊ ဒါမှမဟုတ် ပြောင်းလဲမှု ဘယ်သူ ရေးထားလဲ မဆို ယခင် version ကို checkout လုပ်ပါ။',
      ),
      h2('Task တစ်ခုကို သေသပ်စွာ ပြီးဆုံးအောင် လုပ်ခြင်း'),
      p(
        'ရွေ့ခါနီး၊ "ဘာပြောင်းလဲသွားလဲ၊ ဘာကြောင့်လဲ summarize ပေး" လို့ မေးတာက ကုန်ကျတဲ့ စက္ကန့် ဆယ်ခုထက် တန်ပါတယ် — commit message draft အဖြစ်လည်း သုံးနိုင်ပြီး၊ ပြောင်းလဲမှုက သင်ထင်ထားတဲ့အတိုင်း တကယ်လုပ်ပေးလားဆိုတာ နောက်ဆုံး sanity check အဖြစ်လည်း ရပါတယ်။',
      ),
    ],
  },
  {
    slug: 'claude-code-memory-explained',
    level: 'intermediate',
    title: 'Claude Code ၏ Memory စနစ်ကို ရှင်းပြခြင်း',
    excerpt:
      'CLAUDE.md ဖိုင်များက Claude Code ကို သင်နှင့် သင့် project အကြောင်း ရေရှည်မှတ်ဉာဏ် ဘယ်လိုပေးသလဲ၊ ဘာတွေ ထည့်သင့်သလဲ၊ ဘာတွေ ချန်ထားသင့်သလဲ။',
    readingTime: 7,
    body: [
      p(
        'Chat အသစ်တိုင်း အစကနေ စတင်ပါတယ် — ဒါပေမယ့် ဒီလို မဖြစ်ဖို့လည်း ရပါတယ်။ Claude Code က session တစ်ခု စတင်ချိန် persistent memory file တွေကို ဖတ်နိုင်တယ်၊ ဒါကြောင့် သင် message တစ်ခုမှ မရိုက်ခင်ကတည်းက သင့် convention တွေ၊ stack၊ preference တွေကို သိနေပြီးသား ဖြစ်တယ်။ ဒီ memory mechanism က text file ရိုးရိုးတစ်ခုပါ: CLAUDE.md။',
      ),
      h2('Scope နှစ်မျိုး: Global နှင့် Project'),
      p(
        'Global CLAUDE.md (home directory ထဲမှာ) က သင်ဖွင့်တဲ့ project တိုင်းအတွက် သက်ဆိုင်ပါတယ် — ဘာ project ပဲလုပ်လုပ် သင့်အကြောင်း မှန်ကန်နေတဲ့ အရာတွေအတွက် ကောင်းတယ်: သင့် commit message format၊ ယေဘုယျ workflow preference၊ ထပ်ခါထပ်ခါ သုံးတဲ့ tool တွေ။ Project-level CLAUDE.md (repo root ထဲမှာ) က ဒီနေရာမှာသာ သက်ဆိုင်ပါတယ် — project ရဲ့ architecture၊ သီးသန့် convention တွေ၊ team က ဆုံးဖြတ်ပြီးသား ဆုံးဖြတ်ချက်တွေ ပြန်မငြင်းချင်တာတွေ။',
      ),
      h2('Memory ထဲ ဘာတွေ ထည့်သင့်သလဲ'),
      bullet('Code ကနေ ရှင်းရှင်းမမြင်နိုင်တဲ့ convention တွေ: "named exports ကိုသာ အမြဲသုံး"၊ "test တွေက သူတို့ test လုပ်တဲ့ file ရဲ့ အနီးမှာ ထားရ"။'),
      bullet('Session တိုင်း ထပ်ခါထပ်ခါ ပြောရမယ့် standing instruction တွေ: commit message format တစ်ခု၊ deploy checklist တစ်ခု။'),
      bullet('"ဘာလို့" ဆိုတာ ရှင်းပြတဲ့ context — "ဘာ" မဟုတ်ဘဲ — quirky dependency တစ်ခုအတွက် workaround၊ backstory မရှိရင် ထူးဆန်းနေမယ့် တမင်ရွေးချယ်ထားတဲ့ architectural ဆုံးဖြတ်ချက်။'),
      bullet('တစ်ကြိမ်ထက်ပို ပြင်ပေးခဲ့ရတဲ့ correction တွေ: တူညီတဲ့အရာကို နှစ်ကြိမ် ပြောပြီးပြီဆိုရင်၊ သုံးကြိမ်မြောက် ပြန်မရိုက်ဘဲ memory ထဲ ထည့်သင့်တယ်ဆိုတဲ့ အချက်ပြပါ။'),
      h2('ဘာတွေ မထည့်သင့်သလဲ'),
      bullet('Code ဖတ်ရုံနဲ့ သိနိုင်တဲ့ ဘာမဆို — file structure၊ function တစ်ခုက ဘာလုပ်လဲ၊ tech stack။ ဒါတွေက အချိန်ကြာရင် မှန်ကန်တော့မှာ မဟုတ်ဘူး၊ Claude ကြည့်ရုံနဲ့ ရတယ်။'),
      bullet('Secret၊ credential၊ sensitive ဖြစ်နိုင်တဲ့ ဘာမဆို — memory file တွေက plain text ဖြစ်ပြီး git ထဲ commit ဖြစ်သွားတတ်ပါတယ်။'),
      bullet('ရှည်လျားတဲ့ လုပ်ဆောင်ဆဲ task မှတ်စုတွေ။ ဒါက permanent memory အတွက် မဟုတ်ဘဲ session လက်ရှိထဲက plan ဒါမှမဟုတ် todo list အတွက်ပါ။'),
      h2('အသုံးဝင်နေအောင် ထားပါ၊ ထူထဲမသွားအောင်'),
      p(
        'ရှည်လွန်းတဲ့ memory က သင် ဒါမှမဟုတ် Claude က သေသေချာချာ မဖတ်တော့ပါ။ CLAUDE.md ကို document တစ်ခုလိုပဲ ပုံမှန် ပြန်ကြည့်ပါ — မှန်ကန်တော့မှု မရှိတာတွေကို ဖျက်ပါ၊ ညိုနွမ်းနေတာတွေကို တိကျအောင် လုပ်ပါ၊ ကြီးကျယ်လွန်းနေရင် section တွေခွဲပါ။ တိုတောင်း မှန်ကန်တဲ့ file တစ်ခုက ရှည်လျားပြီး ပျောက်နေတဲ့ file တစ်ခုထက် အမြဲတမ်း ပိုကောင်းတယ်။',
      ),
      h2('Minimal Example တစ်ခု'),
      code(
        '# Commit messages\nUse Conventional Commits: type(scope): summary.\n\n# Testing\nRun `pnpm test` before considering any change done.\nNever skip a failing test to make a deadline -- fix it or flag it.\n\n# Code style\nPrefer named exports. No default exports in this repo.',
        'markdown',
      ),
      h2('Memory က Leash မဟုတ်ဘဲ Starting Point ပါ'),
      p(
        'CLAUDE.md ကို မြှောင်ဆတ်တဲ့ team member အသစ်တစ်ယောက်အတွက် onboarding မှတ်စုလို့ မှတ်ပါ၊ မျက်စိမှိတ် လိုက်နာရမယ့် rulebook လို့ မမှတ်ပါနဲ့။ ဒါက ထပ်ခါထပ်ခါ ပြောရတာကို ကယ်တင်ပေးပြီး၊ Claude Code ကို လူ collaborator တစ်ယောက် ပထမနေ့ လိုချင်မယ့် shared context အတူတူ ပေးပါတယ်။',
      ),
    ],
  },
  {
    slug: 'claude-code-skills-and-slash-commands',
    level: 'intermediate',
    title: 'Skills နှင့် Slash Commands',
    excerpt:
      'Memory က Claude ကို project အကြောင်း အချက်အလက်တွေ ပြောပေးတယ်။ Skills ကတော့ ထပ်ခါထပ်ခါ လုပ်ရတဲ့ လုပ်ငန်းစဉ်တွေကို command တစ်ခုတည်းနဲ့ run နိုင်အောင် ပေးတယ်။',
    readingTime: 6,
    body: [
      p(
        'Memory (CLAUDE.md) က "Claude ဒီ project အကြောင်း ဘာသိရမလဲ" ဆိုတဲ့ မေးခွန်းကို ဖြေပါတယ်။ Skills ကတော့ မတူညီတဲ့ မေးခွန်းကို ဖြေပါတယ်: "Claude ဘယ်လို လုပ်ရမှန်းသိရမလဲ၊ အကြိမ်တိုင်း တူညီအောင်"။ Skill တစ်ခုဆိုတာ နာမည်ပေးထားတဲ့ ပြန်သုံးနိုင်တဲ့ procedure တစ်ခု — တစ်ခါတည်း ရေးထားပြီး /code-review ဒါမှမဟုတ် /deploy-checklist လိုမျိုး slash command နဲ့ run နိုင်တယ် — conversation တိုင်းမှာ multi-step process တစ်ခုတည်းကို ပြန်မရှင်းပြရတော့ပါ။',
      ),
      h2('ရိုးရှင်းတဲ့ Example တစ်ခု'),
      p(
        'Deploy မလုပ်ခင် checklist အတူတူကို အမြဲ လိုချင်တယ်ဆိုပါစို့: test pass လား စစ်တယ်၊ migration ကို reverse လုပ်နိုင်လား စစ်တယ်၊ feature flag ချိတ်ထားလား စစ်တယ်၊ rollback plan ရေးထားလား စစ်တယ်။ ဒါကို အကြိမ်တိုင်း ရိုက်ထည့်နေရတာ ပင်ပန်းပြီး၊ ဖိအားရှိချိန်မှာ မသိစိတ်နဲ့ အတိုကောက်လုပ်တတ်တယ်။ Skill တစ်ခုက ဒါကို တစ်ခါတည်း capture လုပ်ထားတယ်၊ /deploy-checklist run လိုက်ရင် အကြိမ်တိုင်း အတူတူ run သွားတယ်။',
      ),
      h2('Skills vs. ရိုးရိုး မေးခြင်း'),
      p(
        'တစ်ခါတည်း request အတွက်ဆိုရင်၊ ရိုးရှင်းတဲ့ စကားနဲ့ပဲ မေးပါ — ထပ်မလုပ်တော့မယ့် ဘာမဆိုအတွက် ဒါက အတိုက်ရိုက်ဆုံး လမ်းပါ။ Task တစ်ခု ထပ်ခါထပ်ခါ ဖြစ်လာတဲ့အခါ Skills ရဲ့ တန်ဖိုး ပေါ်လာတယ်: release တိုင်းမတိုင်ခင် run တဲ့ process တစ်ခု၊ သီးသန့် review checklist တစ်ခု၊ bug အမျိုးအစားတစ်ခုကို investigate လုပ်ချင်တဲ့ standard နည်းလမ်းတစ်ခု။ Multi-step instruction အတူတူကို သုံးကြိမ် ရိုက်ပြီးသားဆိုရင်၊ skill တစ်ခု လုပ်ဖို့ သင့်တော်ပါပြီ။',
      ),
      h2('Skill တစ်ခု ဘယ်လို တည်ဆောက်ထားလဲ'),
      p(
        'Core အနေနဲ့ skill တစ်ခုက ရှင်းလင်းတဲ့ trigger description (Claude ဘယ်အချိန် သုံးရမှန်းသိအောင်) နဲ့ လုပ်ရမယ့် step ဒါမှမဟုတ် guidance ပါတဲ့ instruction file အတိုလေးပါ။ Job တစ်ခုတည်းပေါ်မှာ focus ထားပါ — မသက်ဆိုင်တဲ့ အရာငါးခုကို လုပ်ကြိုးစားတဲ့ skill တစ်ခုက ရှင်းလင်းတဲ့ skill ငါးခုထက် ယုံကြည်ရခက်ပြီး မှန်ကန်တဲ့ request အတွက် trigger ဖြစ်ရခက်ပါတယ်။',
      ),
      h2('ကိုယ်ပိုင် Skill တစ်ခု ဖန်တီးခြင်း'),
      p(
        'Speculative skill တွေ design မလုပ်ဘဲ၊ တကယ် ထပ်ခါထပ်ခါ ဖြစ်နေတဲ့ pain point ကနေ စတင်ပါ။ Multi-step instruction အတူတူကို တစ်ကြိမ်ထက်ပို ပေးနေတာ သတိထားပါ၊ ဘာလုပ်ခဲ့လဲ ဘယ်အစီအစဉ်နဲ့ လုပ်ခဲ့လဲ အတိအကျ မှတ်ပါ၊ ပြီးတော့ မှန်ကန်တဲ့ request တွေအတွက်ပဲ trigger ဖြစ်ပြီး မသက်ဆိုင်တဲ့ request တွေအတွက် trigger မဖြစ်လောက်အောင် တိကျတဲ့ description ပေးပြီး skill အဖြစ် ပြောင်းလဲပါ။',
      ),
      h2('Agents နှင့် Memory တို့နှင့် ဆက်စပ်ပုံ'),
      p(
        'Memory, skills, agents တို့က ပြဿနာ သုံးမျိုးကို ဖြေရှင်းပေးပါတယ်: memory က standing context ပါ၊ skills က ပြန်သုံးနိုင်တဲ့ procedure တွေပါ၊ agents (ဒီ path ရဲ့ နောက်ပိုင်းမှာ ဖော်ပြမယ်) ကတော့ အလုပ်တစ်ခုလုံးကို Claude instance တစ်ခြားကို လွှဲအပ်ခြင်းအကြောင်းပါ။ ကြီးမားတဲ့ setup တစ်ခုက သုံးမျိုးလုံးကို သုံးတတ်ပါတယ် — မကြာခဏ မပြောင်းလဲတဲ့ အချက်အလက်တွေအတွက် memory၊ ထပ်ခါထပ်ခါ run တဲ့ workflow တွေအတွက် skills၊ အလုံးစုံ လွှဲအပ်နိုင်လောက်အောင် ကြီးမားတဲ့ အလုပ်တွေအတွက် agents။',
      ),
    ],
  },
  {
    slug: 'claude-desktop-computer-use-and-mcp',
    level: 'intermediate',
    title: 'Claude Desktop App — Computer Use နှင့် MCP Connectors',
    excerpt:
      'Desktop app က chat ထက် ထပ်ပေးတာက ဘာလဲ — native app တွေအတွက် ထိန်းချုပ်ထားတဲ့ screen control နဲ့ သင်အသုံးပြုနေတဲ့ tool တွေကို ချိတ်ဆက်ပေးတဲ့ MCP connectors။',
    readingTime: 7,
    body: [
      p(
        'Claude Desktop app က claude.ai လို chat window တစ်ခုကနေ စတင်ပါတယ်၊ ဒါပေမယ့် browser tab တစ်ခုနဲ့ မလုပ်နိုင်တဲ့ အရာနှစ်ခုကို လုပ်နိုင်ပါတယ်: သင့် screen ကို မြင်ပြီး အလုပ်လုပ်နိုင်ခြင်း၊ MCP ကနေတဆင့် တခြား application တွေကို တိုက်ရိုက် ချိတ်ဆက်နိုင်ခြင်း။ ဒါနှစ်ခု ပေါင်းစည်းလိုက်တော့ "မေးခွန်းမေးရမယ့်နေရာ" တစ်ခုကနေ "သင့် condition အပေါ် မူတည်ပြီး သင့်ကွန်ပျူတာကို ခဏတာ ငှားလိုက်နိုင်တဲ့ လက်တစ်ဖက်" အဖြစ် ပြောင်းလဲပေးပါတယ်။',
      ),
      h2('Computer Use'),
      p(
        'သင့် တိကျတဲ့ permission နဲ့၊ Claude က သင့် desktop ရဲ့ screenshot ရိုက်ပြီး တွေ့ရတဲ့အရာအပေါ် အလုပ်လုပ်နိုင်တယ် — နှိပ်ခြင်း၊ စာရိုက်ခြင်း၊ scroll ခြင်း — file ဒါမှမဟုတ် တိုက်ရိုက် အလုပ်လုပ်နိုင်တဲ့ API မရှိတဲ့ native app တွေထဲမှာ: settings panel တစ်ခု၊ desktop Notes app တစ်ခု၊ automation hook လုံးဝမရှိတဲ့ software အဟောင်းတစ်ခု။ ဒါက ဒီကွာဟမှုအတွက် တကယ် အသုံးဝင်ပြီး၊ ပိုသန့်ရှင်းတဲ့ option (file အစစ်၊ API အစစ်၊ terminal command) ရှိနေရင်တော့ မှားယွင်းတဲ့ tool ဖြစ်တယ်။',
      ),
      h2('Permission Tiers'),
      p(
        'App အားလုံး access level တူတူ မရရှိပါ။ Browser တွေက ပုံမှန် read-only ပါ — Claude မြင်နိုင်အောင် context အတွက် မြင်ရတယ်၊ ဒါပေမယ့် click နဲ့ type ကို ပိတ်ထားတယ်၊ navigate အစစ်ကို browser extension နဲ့ ကိုင်တွယ်တယ်။ Terminal နဲ့ IDE တွေက click-only ဖြစ်ခဏ ရှိတယ် — window တစ်ခုကို ရှေ့ဆွဲတာ ဒါမှမဟုတ် button နှိပ်တာ လုပ်နိုင်တယ်၊ ဒါပေမယ့် type နဲ့ key press ပိတ်ထားတယ်။ ကျန်တာအားလုံး full control ရနိုင်တယ်။ ဒီ tiering ရှိတာက sensitive app တစ်ခုထဲက overreach တစ်ခု ဘေးကင်းစွာ fail ဖြစ်အောင်၊ တိတ်တဆိတ် အောင်မြင်မသွားအောင် တမင် ထားတာပါ။',
      ),
      h2('MCP Connectors'),
      p(
        'MCP (Model Context Protocol) ဆိုတာ Claude က ပြင်ပ tool တွေကို structured ဖြစ်ပြီး authenticated ဖြစ်တဲ့ access နဲ့ ချိတ်ဆက်တဲ့ နည်းလမ်းပါ — သင့် email, calendar, Slack, Linear လို project tracker — interface ပေါ်မှာ နှိပ်နေတာထက်။ ချိတ်ဆက်ထားတဲ့ tool တစ်ခုက Claude ကို real, scoped action တွေ ပေးတယ် ("ဒီ calendar event ဖန်တီးပေး"၊ "ဒီ message တွေထဲ ရှာပေး") screenshot ပေါ်က pixel ခန့်မှန်းနေတာထက်၊ ဒါက ပိုယုံကြည်ရပြီး Claude ဘာလုပ်ခွင့်ရှိလဲဆိုတာ ပိုနားလည်လွယ်စေတယ်။',
      ),
      h2('ဒါ vs. Claude Code ဘယ်အချိန် ရွေးမလဲ'),
      bullet('File, terminal, codebase အတွင်းသာ ရှိနေတဲ့ task — Claude Code ကို အတိအကျ ဒီအတွက် တည်ဆောက်ထားတာ၊ ပိုမြန်ပြီး ပိုယုံကြည်ရတယ်။'),
      bullet('Native app, desktop environment, ဒါမှမဟုတ် MCP ကနေသာ ဝင်ရောက်နိုင်တဲ့ service တွေပါတဲ့ task — Desktop app က မှန်ကန်တဲ့ ရွေးချယ်မှုပါ။'),
      bullet('ပိုကြီးတဲ့ workflow တစ်ခုအတွက် နှစ်ခုလုံး မှန်ကန်နိုင်တယ်: Claude Code မှာ code ရေးပြီး၊ Desktop app ထဲက MCP connector နဲ့ tracked ticket update လုပ်တာ ဒါမှမဟုတ် channel တစ်ခုကို notify လုပ်တာ။'),
      h2('ထားသင့်တဲ့ Safety အလေ့အကျင့်'),
      p(
        'Email, message, ဒါမှမဟုတ် document ထဲက link တွေကို သင်ကိုယ်တိုင် သုံးသပ်မယ့်အတိုင်း သုံးသပ်ပါ — default အားဖြင့် သံသယဖြစ်ပါ။ Agent တစ်ခုကို link တစ်ခု follow ခိုင်းခင် အစစ်အမှန် destination ကို verify လုပ်ပါ၊ ပြီးတော့ financial transaction တစ်ခုကို — order တင်တာ၊ ငွေပို့တာ၊ trade execute လုပ်တာ — computer use ကို supervision မရှိဘဲ ပြီးစီးခိုင်းတာ လုံးဝ မလုပ်ပါနဲ့။ ဒါတွေက လူသားက တမင်၊ အကြိမ်တိုင်း လုပ်ရမယ့် action တွေအဖြစ် ဆက်ရှိနေပါတယ်။',
      ),
    ],
  },
  {
    slug: 'claude-code-agents-and-subagents',
    level: 'advanced',
    title: 'Agents နှင့် Subagents — ဘယ်အချိန် လွှဲအပ်မလဲ၊ ဘယ်လို ညွှန်ကြားမလဲ',
    excerpt:
      'Subagent ဆိုတာ အလုပ်တစ်ခုအတွက် သင်ဖန်တီးလိုက်တဲ့ သီးခြား Claude instance တစ်ခု။ ဘယ်အခါ လွှဲအပ်ရမလဲ၊ ကျွမ်းကျင်တဲ့ လုပ်ဖော်ကိုင်ဖက်လို ဘယ်လို ညွှန်ကြားရမလဲ ဆိုတာ နားလည်ထားရင် အသုံးပြုမှု level တက်လာစေတယ်။',
    readingTime: 8,
    body: [
      p(
        'ဒီ path အခုအထိက Claude instance တစ်ခုတည်း သင်နဲ့ အတူ conversation တစ်ခုထဲမှာ အလုပ်လုပ်နေတာအကြောင်းပါ။ Subagent တစ်ခုက မတူပါ: သီးခြား context window ရှိတဲ့ instance တစ်ခု၊ self-contained အလုပ်တစ်ခုကို ကိုင်တွယ်ပြီး result ပြန်တင်ဖို့ spawn လုပ်လိုက်တာပါ — Step တိုင်းကို သင်ကိုယ်တိုင် လမ်းလျှောက်နေတာထက်။',
      ),
      h2('ဘာကြောင့် Delegate လုပ်ရတာလဲ'),
      bullet('Parallelism — သက်ဆိုင်မှုမရှိတဲ့ research ဒါမှမဟုတ် အလုပ် အပိုင်းတွေကို တစ်ပြိုင်နက် run နိုင်တယ်၊ တစ်ခုပြီးမှ တစ်ခု မဟုတ်ဘဲ။'),
      bullet('Context Protection — Subagent တစ်ခုက log file ကြီးတစ်ခု ဒါမှမဟုတ် ကျယ်ပြန့်တဲ့ search တစ်ခုကို ဖတ်ပြီး အရေးကြီးတဲ့ line သုံးလိုင်းကိုပဲ ပြန်ပေးနိုင်တယ်၊ noise အားလုံးကို သင့် main conversation ထဲ မဖြည့်ဘဲ။'),
      bullet('Focus — ကျဉ်းမြောင်းတဲ့ job တစ်ခုပေးထားတဲ့ subagent တစ်ခုက အရာများစွာကို တစ်ပြိုင်နက် ကိုင်တွယ်နေတဲ့ instance တစ်ခုထက် ပိုယုံကြည်ရအောင် လုပ်နေတတ်ပါတယ်။'),
      h2('ဘယ်အချိန် ဂရုမစိုက်သင့်လဲ'),
      p(
        'Delegation မှာ overhead ရှိပါတယ်: Subagent အသစ်တစ်ခုက အခုအထိ သင့် conversation ကို မမြင်ရသေးတဲ့အတွက်၊ ကောင်းစွာ ညွှန်ကြားရတာ တကယ် ကြိုးစားမှု လိုပါတယ်၊ ပြီးတော့ line နှစ်လိုင်း အကြောင်းအတွက် တစ်ခု spin up လုပ်တာက ချွေတာရတာထက် ပိုကုန်ကျတတ်ပါတယ်။ ဘယ် file ကို ကြည့်ရမှန်း သင်တကယ် သိပြီးသားဆိုရင်၊ ကြည့်လိုက်ပါ — ဒါမှမဟုတ် လက်ရှိ conversation ထဲမှာ တိုက်ရိုက် မေးပါ။ Subagent တွေကို တကယ် ကြီးမားတဲ့၊ သီးခြားဖြစ်တဲ့၊ ဒါမှမဟုတ် မမြင်ချင်တဲ့ အသေးစိတ်တွေနဲ့ သင့် main context ကို ဖြည့်စေမယ့် အလုပ်တွေအတွက်ပဲ သိမ်းထားပါ။',
      ),
      h2('Subagent ကို ကျွမ်းကျင်တဲ့ Colleague လို Brief လုပ်ခြင်း'),
      p(
        'Subagent တစ်ခုက အေးခဲတဲ့ အခြေအနေကနေ စတင်ပါတယ်: သင့် conversation ကို မမြင်ရသေးပါ၊ သင် ဘာတွေ ကြိုးစားပြီးပြီဆိုတာ မသိပါ၊ task ဘာကြောင့် အရေးကြီးလဲဆိုတာ မသိပါ။ Brief ကောင်းတစ်ခုမှာ goal တစ်ခု၊ သင် ရှာဖွေပြီးသားဖြစ်တဲ့ background၊ ကျဉ်းမြောင်းတဲ့ instruction တစ်ခုကို follow ရုံထက် judgment call လုပ်နိုင်လောက်တဲ့ context၊ ပြီးတော့ — လိုအပ်ရင် — response ဘယ်လို ရှည်ရမလဲ ဆိုတာ ပါဝင်ရပါမယ်။',
      ),
      h2('Task တစ်ခုကို Phrase ရေးနည်း နှစ်မျိုး'),
      bullet('Lookups: တိတိကျကျ ဘာစစ်ရမယ်ဆိုတာကို လွှဲပေးပါ — run ရမယ့် command၊ ဖတ်ရမယ့် file တိတိကျကျ။ အဖြေမှန် တစ်ခုတည်း ရှိတယ်၊ method ကို subagent ကို မခန့်မှန်းခိုင်းပါနဲ့။'),
      bullet('Investigations: prescribed step list မဟုတ်ဘဲ မေးခွန်းကိုပဲ လွှဲပေးပါ။ "ဘယ်လို" ကို အရှင်းပြုလွန်းရင်၊ သင့် step ထဲက မှားယွင်းတဲ့ assumption က result ထဲက မှားယွင်းတဲ့ assumption ဖြစ်သွားပါလိမ့်မယ်။'),
      h2('Worked Example တစ်ခု'),
      p(
        'အားနည်းတဲ့ brief: "database ကို စစ်ပါ။" အားကောင်းတဲ့ brief: "50 သန်းရော် row ရှိတဲ့ table တစ်ခုမှာ backfill default နဲ့ NOT NULL column တစ်ခု ထည့်တဲ့ migration တစ်ခုက concurrent write တွေအောက်မှာ ဘေးကင်းလားဆိုတာ ဆုံးဖြတ်နေတယ်။ Basic locking behavior ကို စစ်ပြီးသားပါ။ Backfill approach ကိုယ်တိုင် ဘေးကင်းလားဆိုတာ independent read တစ်ခု လိုချင်တယ် — ဘေးကင်းမှု မရှိရင် တိတိကျကျ ဘာ break ဖြစ်မလဲ။ Word 200 အောက် ဖြေပါ။"',
      ),
      h2('Result ကို ပြန်ဖတ်ခြင်း'),
      p(
        'Subagent ရဲ့ summary က ဘာလုပ်ရည်ရွယ်ခဲ့သလဲ ဖော်ပြတာပါ၊ တကယ် လုပ်ခဲ့သမျှ အားလုံး မဟုတ်ချင်ပါ — colleague ရဲ့ status update ကို starting point အဖြစ် မှတ်ယူသလိုမျိုး၊ stake အစစ်အမှန် ရှိချိန်မှာ diff ဒါမှမဟုတ် output အစစ်ကို ကြည့်တာရဲ့ အစားထိုးကောင်းမွန်တဲ့ အရာ မဟုတ်ပါ။ ယုံကြည်ပါ၊ ဒါပေမယ့် verify လုပ်ပါ၊ recommendation တစ်ခုပေါ်အပေါ် action လုပ်ခင်တော့ အထူးသဖြင့်။',
      ),
      h2('Agents များစွာ၊ Task တစ်ခု'),
      p(
        'တစ်ခုနဲ့တစ်ခု dependency မရှိတဲ့ သီးခြား subtask တွေ — မသက်ဆိုင်တဲ့ library သုံးခုကို research လုပ်တာ၊ မသက်ဆိုင်တဲ့ file နှစ်ခုကို review လုပ်တာ — ကို တစ်ခုပြီးမှ တစ်ခု မဟုတ်ဘဲ subagent များစွာကို တစ်ပြိုင်နက် လွှဲပေးနိုင်ပါတယ်။ အလုပ်တစ်ခုက တခြားတစ်ခုရဲ့ result အပေါ် မှီခိုသွားတဲ့ အချိန်ရောက်ရင်၊ ဒီ parallelism ရပ်ရပါမယ် — မရဖြစ်သေးတဲ့ အဖြေကို ခန့်မှန်းနေတာထက် sequence လုပ်ပါ။',
      ),
    ],
  },
  {
    slug: 'claude-in-chrome-safe-web-automation',
    level: 'advanced',
    title: 'Claude in Chrome — ဘေးကင်းသော Web Automation',
    excerpt:
      'Chrome extension က Claude ကို web page တွေပေါ်မှာ ဖတ်ခြင်း၊ နှိပ်ခြင်း၊ စာရိုက်ခြင်း လုပ်ပေးနိုင်အောင် ပြုလုပ်တယ်။ ဘယ်အရာအတွက် တကယ်ကောင်းသလဲ၊ ဘယ်လို လုံခြုံမှု အလေ့အကျင့်တွေ မထားလို့မဖြစ်သလဲ။',
    readingTime: 7,
    body: [
      p(
        'Claude in Chrome extension က Claude ကို သင့် browser အတွင်းမှာ မျက်စိနဲ့ လက်တွေ ပေးပါတယ်: page တစ်ခုရဲ့ content ဖတ်နိုင်တယ်၊ link နဲ့ button တွေ နှိပ်နိုင်တယ်၊ form ဖြည့်နိုင်တယ်၊ tab တွေကြား ရွှေ့နိုင်တယ် — သင် manual လုပ်မယ့် အရာအားလုံးကို၊ တစ်ခုချင်း နှိပ်နေတာထက် ရိုးရှင်းတဲ့ စကားနဲ့ ဖော်ပြပြီး။',
      ),
      h2('ဘာအတွက် တကယ် ကောင်းသလဲ'),
      bullet('တူညီတဲ့ record များစွာကို form ထပ်ခါထပ်ခါ ဖြည့်ရတာ — mechanical ဖြစ်တာကြောင့် ပင်ပန်းတဲ့ task အမျိုးအစား။'),
      bullet('Tab များစွာမှာ ပျံ့နှံ့နေတဲ့ အချက်အလက်ကို စုဆောင်းပြီး တစ်နေရာတည်း ပြန်ယူခြင်း။'),
      bullet('ပြောင်းလဲမှုတစ်ခုပြီးနောက် manual sanity check အဖြစ်၊ user အစစ်တစ်ယောက်လို သင့် web app ကိုယ်တိုင် စမ်းသပ်ခြင်း။'),
      h2('ဘယ်နေရာမှာ Risk ရှိသလဲ'),
      p(
        'ငွေကြေးပါတဲ့ ဒါမှမဟုတ် ပြန်ပြောင်းမရတဲ့ action ပါတဲ့ ဘာမဆိုက အကြိမ်တိုင်း လူသားလက်ကို လိုချင်ပါတယ်: order တင်ခြင်း၊ ငွေပေးချေမှု ပို့ခြင်း၊ ပြန်ရုပ်သိမ်းလို့ မရတဲ့ ဘာမဆို submit ခြင်း။ Extension ကို ဒီ step တွေကို supervision မရှိဘဲ ပြီးစီးအောင် မဟုတ်ဘဲ၊ သင်ကိုယ်တိုင် နှိပ်ပြီး ဖြတ်သန်းနိုင်အောင် တည်ဆောက်ထားတာပါ၊ ဒီ boundary ကို တမင် လေးစားသင့်ပါတယ်၊ ဖြတ်ကျော်ရမယ့် ကန့်သတ်ချက်တစ်ခုလို့ မမှတ်ပါနဲ့။',
      ),
      h2('Link Safety အထူးသဖြင့်'),
      p(
        'Email, chat message, ဒါမှမဟုတ် မရင်းနှီးတဲ့ source ကနေ page တွေထဲက link တွေက default အားဖြင့် သံသယဖြစ်ပါတယ် — link တစ်ခုရဲ့ မြင်ရတဲ့ text က တစ်မျိုးပြောနေနိုင်ပေမယ့် အစစ်အမှန် destination က လုံးဝ တခြားတစ်မျိုး ဖြစ်နေနိုင်တယ်။ မရင်းနှီးတဲ့ link တစ်ခုကို follow မလုပ်ခင်၊ link text ကနေ မှန်းခြင်းမဟုတ်ဘဲ အစစ်အမှန် URL ကို စစ်ဆေးသင့်ပါတယ်။ Destination တစ်ခု အနည်းငယ်တောင် မှားနေပုံပေါ်ရင်၊ ရှေ့ဆက်တိုးမယ့်အစား လူတစ်ယောက်နဲ့ confirm လုပ်ဖို့ တန်ပါတယ်။',
      ),
      h2('Task တစ်ခုကို ကောင်းစွာ ပေးခြင်း'),
      p(
        'Click တစ်ခုချင်းစီကို narrate မလုပ်ဘဲ၊ ဘယ် outcome လိုချင်လဲနဲ့ အရေးကြီးတဲ့ constraint ကို ပြောပါ: "ဒီ address list ကို လှည့်ပြီး shipping form ကို တစ်ခုချင်းစီအတွက် ဖြည့်ပေး၊ field တစ်ခု required ဖြစ်မှ တလွဲ default option တွေ သုံးပါ" ဆိုတာ complete brief တစ်ခုပါ။ Click တိုင်းကို micromanage လုပ်ရင် task ကို automate လုပ်တဲ့ point ပျောက်သွားပါလိမ့်မယ်။',
      ),
      h2('ရှည်လျားတဲ့ Task တွေမှာ Loop ထဲ ဆက်ရှိနေခြင်း'),
      p(
        'Step နှစ်ခုထက် ပိုတဲ့ ဘာမဆိုအတွက်၊ တစ်ဝက်လမ်းမှာ ပြန်စစ်ခြင်း — data ဒီအထိ မှန်ကန်နေလား၊ မျှော်လင့်ထားတဲ့ page ပေါ်ရောက်နေလား — က ကုန်ကျစရိတ် နည်းပါးပြီး record နှစ်ဆယ် မှားယွင်းတဲ့ နည်းတူတူနဲ့ ဖြည့်ပြီးတဲ့ နောက်ပိုင်းထက် ပြဿနာတွေကို ဖိုးအသက်သာချိန်မှာ ဖမ်းမိစေပါတယ်။',
      ),
    ],
  },
  {
    slug: 'claude-code-plan-mode-worktrees-hooks-at-scale',
    level: 'professional',
    title: 'Plan Mode, Worktrees, Hooks — Claude ကို လုံခြုံစွာ Scale ချဲ့အသုံးပြုခြင်း',
    excerpt:
      'Professional level — ပြောင်းလဲမှုမလုပ်ခင် ဘေးကင်းစွာ စစ်ဆေးနည်း၊ agent အလုပ်များကို ပြိုင်တူ run နည်း၊ hooks နဲ့ policy automate နည်း၊ ရေရှည်ဆောင်ရွက်နိုင်စေတဲ့ team အလေ့အကျင့်များ။',
    readingTime: 9,
    body: [
      p(
        'ဒီအထိ အားလုံးက task တစ်ခုပေါ်မှာ session တစ်ခု အကြောင်းပါ။ Claude Code ကို professional ဖြစ်အောင် အသုံးပြုခြင်း — team တစ်ခုလုံးအတွက်၊ တစ်နေ့မှာ task များစွာအတွက်၊ production system တွေပေါ်မှာ — က process layer တစ်ခု ထပ်ပေါင်းထည့်ပါတယ်: ဘေးကင်းစွာ investigate လုပ်နည်း၊ collision မရှိဘဲ parallel run လုပ်နည်း၊ policy ကို automatic enforce လုပ်နည်း၊ ပြောင်းလဲမှုတွေ ထုတ်ပေးနေတဲ့ speed အတိုင်း review လုပ်နိုင်နေအောင် ထားနည်း။',
      ),
      h2('Plan Mode: Commit မလုပ်ခင် ကြည့်ပါ'),
      p(
        'Non-trivial ဖြစ်တဲ့ ဘာမဆိုအတွက်၊ "approach ရှာဖွေခြင်း" ကို "ပြောင်းလဲမှု လုပ်ခြင်း" ကနေ ခွဲထားတာ တန်ပါတယ်။ Plan mode က အတိအကျ ဒါကို လုပ်ပါတယ် — Claude က ဘာမှ edit မလုပ်ဘဲ investigate လုပ်ပြီး approach တစ်ခု ပြသပါတယ်၊ သင် plan ကိုယ်တိုင် review ပြီး adjust လုပ်ပါတယ်၊ approve လုပ်မှသာ actual ပြောင်းလဲမှုကို စလုပ်ပါတယ်။ ဒါက မှားယွင်းတဲ့ approach တစ်ခုကို ဖြုတ်ရမယ့် edit အစုအဝေး မဟုတ်သေးဘဲ စာပိုဒ်တစ်ခုတည်းအနေနဲ့ ရှိနေချိန်မှာ ဖမ်းမိစေပါတယ်။',
      ),
      h2('Worktrees: Collision မရှိဘဲ Parallel အလုပ်'),
      p(
        'Git worktree တွေက repository တစ်ခုတည်းရဲ့ branch တစ်ခုထက်ပိုတာကို folder သီးခြားများထဲ တစ်ချိန်တည်း checkout လုပ်ခွင့် ပေးပါတယ်။ Agent အလုပ်အတွက်ဆိုရင်၊ ဒါက Claude Code ကို သက်ဆိုင်မှုမရှိတဲ့ task နှစ်ခုပေါ်မှာ တစ်ပြိုင်နက် run နိုင်တယ် — worktree တစ်ခုမှာ bug fix တစ်ခု၊ နောက်တစ်ခုမှာ feature တစ်ခု — တစ်ခုရဲ့ လုပ်ဆောင်ဆဲ edit က နောက်တစ်ခုကို မနှောင့်ယှက်ဘဲ၊ folder တစ်ခုတည်းထဲမှာ branch အသွားအလာ မလုပ်ဘဲ။',
      ),
      code('git worktree add ../my-project-fix-123 -b fix-123\ncd ../my-project-fix-123\nclaude'),
      h2('Hooks: Judgment မဟုတ်ဘဲ Policy ကို Automate ခြင်း'),
      p(
        'Hooks တွေက event တွေအပေါ် တုံ့ပြန်ပြီး shell command တစ်ခုကို automatic run ပါတယ် — tool တစ်ခု run ခင်၊ session ပြီးနောက်၊ ပြီးတော့ ဒါအလားတူ trigger တွေ။ ဒါတွေက ဘယ်တော့မှ skip လုပ်ချင်မယ့် policy အတွက် မှန်ကန်တဲ့ နေရာပါ: file edit တစ်ခုပြီးတိုင်း linter ကို အမြဲ run ပါ၊ denylist ပေါ်က command တစ်ခုကို အမြဲ block ပါ၊ ရှည်လျားတဲ့ task ပြီးတဲ့အခါ channel တစ်ခုကို အမြဲ notify ပါ။ Hooks တွေကို mechanical ဖြစ်ပြီး deterministic ဖြစ်အောင် ထားပါ — judgment လိုအပ်တဲ့ ဘာမဆို conversation ထဲမှာ ရှိသင့်တယ်၊ hook ထဲမှာ မဟုတ်ပါ။',
      ),
      h2('တမင် ရွေးချယ်ထားတဲ့ Permission Modes'),
      p(
        'Claude Code ကို မေးခြင်းမရှိဘဲ ဘယ်လောက်လုပ်ခွင့်ပေးမလဲဆိုတာ on/off switch တစ်ခုတည်း မဟုတ်ဘဲ dial တစ်ခုပါ — action တစ်ခုချင်းစီကို approve လုပ်ရတာကနေ၊ ကြိုတင် ထားရှိတဲ့ guardrail အတွင်းမှာ ပို autonomous ဖြစ်စွာ run တာအထိ။ Mode ကို အလုပ်ရဲ့ blast radius နဲ့ ကိုက်ညီအောင် ထားပါ: production ဒါမှမဟုတ် shared infrastructure ကို ထိတဲ့ ဘာမဆိုအတွက် tight permission၊ stake နည်းပြီး လွယ်ကူစွာ revert လုပ်နိုင်တဲ့ local အလုပ်အတွက် looser permission — step တိုင်း confirm ဖို့ နှေးကွေးခြင်းက safety ထပ်ပေါင်းမပေးဘဲ friction ထပ်ပေါင်းပေးတဲ့ နေရာမှာ။',
      ),
      h2('ရေးထားသင့်တဲ့ Team Convention များ'),
      bullet('Team member တိုင်းရဲ့ session တွေ baseline context တူညီကနေ စတင်အောင် project-level CLAUDE.md တစ်ခု shared ထားပါ။'),
      bullet('ဘယ်သူ — ဒါမှမဟုတ် ဘာ — ရေးထားလဲ မဆို merge မလုပ်ခင် human review အမြဲ ရရမယ်ဆိုတဲ့ ရှင်းလင်းတဲ့ line တစ်ခု။'),
      bullet('Hooks တွေ automatic ဘာတွေ enforce လုပ်မလဲ vs. code review မှာ human judgment call အဖြစ် ဘာတွေ ဆက်ထားမလဲ ဆိုတာ သဘောတူညီချက်။'),
      h2('Experience တိုးလာလည်း မပျောက်သင့်တဲ့ Safety အလေ့အကျင့်များ'),
      bullet('Diff ကို ဖတ်ပါ။ အကြိမ်တိုင်း။ လိုအပ်တယ်လို့ မခံစားရတော့တဲ့ အချိန်မှာ အထူးသဖြင့် — တကယ့် mistake တစ်ခု ပြေးကျင်တာက အဲ့ဒီအချိန်မှာတိုက်ရိုက်ပါ။'),
      bullet('Hooks တွေကို skip မလုပ်ပါနဲ့ ဒါမှမဟုတ် safety check (--no-verify စသည်) တွေကို မအဆင်ပြေတဲ့ failure တစ်ခု ဖြတ်ကျော်ဖို့ shortcut အနေနဲ့ မသုံးပါနဲ့ — root cause ကို ပြင်ပါ။'),
      bullet('Destructive operation တွေ — force push, hard reset, table drop — ကို default အနေနဲ့ မဟုတ်ဘဲ၊ တမင် သီးခြား confirmation လိုအပ်တဲ့ အရာအနေနဲ့ မှတ်ပါ။'),
      p(
        'ဒါအားလုံးက မယုံကြည်မှုနဲ့ မသက်ဆိုင်ပါ။ အင်အားကြီးပြီး မြန်ဆန်တဲ့ tool တစ်ခုလုံးအတွက် သင်လိုချင်မယ့် professional discipline အတူတူပါပဲ — code review, staged rollout, ရှင်းလင်းတဲ့ ownership — Junior engineer မဟုတ်ဘဲ AI ဖြစ်နေတဲ့ collaborator တစ်ယောက်ပေါ်မှာ ကျင့်သုံးထားတာပါ။ Task တွေ ပိုကြီးလာပြီး leverage က အစစ်အမှန် ဖြစ်လာတယ်၊ ဒီ leverage ကို ဘေးကင်းစွာ သုံးနိုင်အောင် လုပ်ပေးတာက verification အလေ့အကျင့်တွေပါ။',
      ),
    ],
  },
]

async function main() {
  console.log('seed-claude-code-path: writing English lessons...')
  for (const lesson of lessonsEn) {
    await client.createOrReplace({
      // drafts.-prefixed: creates a Studio draft, not a published document --
      // the author reviews and hits Publish themselves. Reference fields below
      // still point at the plain (published-style) id; Sanity's perspective
      // system resolves that to the draft automatically until it's published.
      _id: `drafts.article-${lesson.slug}`,
      _type: 'article',
      title: lesson.title,
      slug: { _type: 'slug', current: lesson.slug },
      excerpt: lesson.excerpt,
      body: lesson.body,
      readingTime: lesson.readingTime,
      language: 'en',
      translationStatus: 'human',
      author,
      level: { _type: 'reference', _ref: `level-${lesson.level}` },
      roles: ['developer', 'software-engineer', 'devops'].map((roleKey) => ({
        _type: 'reference',
        _ref: `role-${roleKey}`,
        _key: key(),
      })),
      topics: [{ _type: 'reference', _ref: 'topic-tools', _key: key() }],
    })
    console.log(`  - [en] ${lesson.title}`)
  }

  console.log('seed-claude-code-path: writing Burmese lessons...')
  for (const lesson of lessonsMy) {
    const enId = `article-${lesson.slug}`
    await client.createOrReplace({
      _id: `drafts.${enId}-my`,
      _type: 'article',
      title: lesson.title,
      slug: { _type: 'slug', current: lesson.slug },
      excerpt: lesson.excerpt,
      body: lesson.body,
      readingTime: lesson.readingTime,
      language: 'my',
      // Weak: the EN counterpart currently exists only as a draft, so Sanity
      // can't validate a strong reference to its eventual published id yet.
      translationOf: { _type: 'reference', _ref: enId, _weak: true },
      translationStatus: 'machine-draft',
      author,
      level: { _type: 'reference', _ref: `level-${lesson.level}` },
      roles: ['developer', 'software-engineer', 'devops'].map((roleKey) => ({
        _type: 'reference',
        _ref: `role-${roleKey}`,
        _key: key(),
      })),
      topics: [{ _type: 'reference', _ref: 'topic-tools', _key: key() }],
    })
    console.log(`  - [my] ${lesson.title}`)
  }

  console.log('seed-claude-code-path: writing learning path...')
  await client.createOrReplace({
    _id: 'drafts.learningPath-claude-code-beginner-to-professional',
    _type: 'learningPath',
    title: {
      en: 'Claude Code: Beginner to Professional',
      my: 'Claude Code: လေ့လာသူမှ ကျွမ်းကျင်သူအထိ',
    },
    slug: { _type: 'slug', current: 'claude-code-beginner-to-professional' },
    description: {
      en: 'Everything from your first terminal session to running Claude safely across a team -- Claude Code, claude.ai, the Desktop app, the Chrome extension, agents, skills, and memory, in order.',
      my: 'ပထမဆုံး terminal session ကနေ team တစ်ခုလုံးအတွက် Claude ကို ဘေးကင်းစွာ run တဲ့အထိ — Claude Code, claude.ai, Desktop app, Chrome extension, agents, skills, memory အားလုံးကို အစီအစဉ်တကျ။',
    },
    level: { _type: 'reference', _ref: 'level-beginner' },
    // Weak: the lessons currently exist only as drafts.
    articles: lessonsEn.map((lesson) => ({
      _type: 'reference',
      _ref: `article-${lesson.slug}`,
      _weak: true,
      _key: key(),
    })),
  })

  console.log(
    `seed-claude-code-path: done (${lessonsEn.length} English + ${lessonsMy.length} Burmese lessons + 1 learning path)`,
  )
}

main().catch((error) => {
  console.error('seed-claude-code-path: failed', error)
  process.exit(1)
})
