#!/usr/bin/env node
// Generate static niche landing pages for GitHub Pages
// Run: node generate-niche-pages.js

const fs = require('fs');
const path = require('path');

const niches = [
    {
        slug: "real-estate", industry: "Real Estate Agents", emoji: "🏠",
        headline: 'Close More Deals While Your AI <span class="gradient-text">Handles the Rest</span>',
        sub: "Your AI agent responds to inquiries, books showings, follows up with leads, and qualifies prospects — 24/7. Never lose a lead to slow response times again.",
        pains: [
            "Leads go cold because you can't respond fast enough",
            "Drowning in emails and scheduling showings manually",
            "Spending hours on follow-up instead of closing deals",
            "Missing calls while you're at property viewings",
            "Manually entering leads into your CRM every day",
            "Weekend inquiries sit unanswered until Monday",
        ],
        solutions: [
            { icon: "⚡", title: "Instant Lead Response", desc: "Your AI responds to new inquiries in under 60 seconds — day or night. Qualifies buyers by budget, location, and timeline." },
            { icon: "📅", title: "Auto-Schedule Showings", desc: "Syncs with your Google Calendar. Prospects book viewing times without you lifting a finger." },
            { icon: "📧", title: "Email Follow-Up", desc: "Automated nurture sequences that feel personal. Your AI remembers each prospect's preferences." },
            { icon: "📞", title: "Voice Agent", desc: "AI answers your business line, qualifies callers, and books appointments directly into your calendar." },
            { icon: "🔗", title: "CRM Integration", desc: "Automatically pushes qualified leads to HubSpot, Follow Up Boss, or your CRM of choice." },
            { icon: "📊", title: "Deal Pipeline", desc: "Real-time dashboard showing your pipeline, response rates, and which leads are hottest." },
        ],
        stats: [{ v: "< 60s", l: "Response Time" }, { v: "3x", l: "More Showings" }, { v: "24/7", l: "Lead Coverage" }],
        testimonial: { quote: "I went from losing leads on weekends to booking 3x more showings. My AI agent handles the initial contact and I step in when they're ready to tour.", name: "Sarah M.", role: "Residential Real Estate Agent" },
        cta: "Automate Your Real Estate Business",
    },
    {
        slug: "coaches", industry: "Online Coaches", emoji: "🎯",
        headline: 'Scale Your Coaching <span class="gradient-text">Without Burning Out</span>',
        sub: "Your AI agent handles discovery calls qualification, scheduling, client onboarding, and follow-ups — so you can focus on transforming lives.",
        pains: ["Too many DMs and emails to respond to personally", "Discovery calls with unqualified prospects waste your time", "Client onboarding is manual and inconsistent", "You can't scale past 1-on-1 without losing quality", "Follow-up with past clients falls through the cracks", "Admin work takes time away from actual coaching"],
        solutions: [
            { icon: "🎯", title: "Lead Qualification", desc: "Your AI asks the right questions upfront. Only qualified prospects make it to your calendar." },
            { icon: "📋", title: "Auto Onboarding", desc: "New clients receive welcome packets, intake forms, and session prep — all automated." },
            { icon: "💬", title: "Client Support", desc: "AI handles routine questions between sessions. Escalates urgent needs to you." },
            { icon: "📅", title: "Smart Scheduling", desc: "Integrates with your calendar. Handles reschedules and reminders without your input." },
            { icon: "📧", title: "Nurture Sequences", desc: "Past clients and warm leads get personalized check-ins that drive re-enrollment." },
            { icon: "📊", title: "Client Dashboard", desc: "Track client progress, session history, and engagement metrics in one place." },
        ],
        stats: [{ v: "5x", l: "Client Capacity" }, { v: "80%", l: "Less Admin" }, { v: "24/7", l: "Client Support" }],
        testimonial: { quote: "I doubled my client roster without hiring an assistant. The AI handles all the back-and-forth scheduling and onboarding.", name: "James K.", role: "Business Coach, 6-Figure Practice" },
        cta: "Scale Your Coaching Practice",
    },
    {
        slug: "agencies", industry: "Digital Agencies", emoji: "🚀",
        headline: 'Run Your Agency on <span class="gradient-text">Autopilot</span>',
        sub: "White-label AI agents that handle client communication, project updates, reporting, and lead nurturing — so your team focuses on creative work.",
        pains: ["Client communication eats up 40% of your team's time", "Status update requests interrupt deep creative work", "Lead nurturing falls apart when you're busy with deliverables", "Onboarding new clients takes weeks of manual setup", "Reporting is a monthly nightmare of manual data pulling", "You can't scale without hiring more account managers"],
        solutions: [
            { icon: "🤖", title: "Client Communication Bot", desc: "AI handles routine client questions, status updates, and asset requests. White-labeled with your brand." },
            { icon: "📊", title: "Auto Reporting", desc: "Pull data from Google Analytics, social platforms, and ad accounts. Generate beautiful reports automatically." },
            { icon: "🎯", title: "Lead Nurturing", desc: "Qualify inbound leads, follow up with proposals, and book discovery calls — all on autopilot." },
            { icon: "📋", title: "Client Onboarding", desc: "Automated welcome sequences, questionnaires, and access provisioning for new clients." },
            { icon: "🏷️", title: "White Label", desc: "Deploy AI agents under your agency brand. Offer AI services as an upsell to existing clients." },
            { icon: "🔗", title: "Tool Integration", desc: "Connects to Slack, Asana, Trello, HubSpot, Google Workspace, and 200+ more." },
        ],
        stats: [{ v: "60%", l: "Time Saved" }, { v: "∞", l: "Scalability" }, { v: "$50K+", l: "Revenue Unlock" }],
        testimonial: { quote: "We added AI agent services as an upsell and it became our highest-margin offering. The white-label feature means clients think it's our technology.", name: "Marcus T.", role: "Founder, Digital Marketing Agency" },
        cta: "Automate Your Agency",
    },
    {
        slug: "ecommerce", industry: "E-Commerce Brands", emoji: "🛒",
        headline: 'Sell More, Support Less with <span class="gradient-text">AI Agents</span>',
        sub: "Your AI handles customer support, order inquiries, returns, product recommendations, and abandoned cart recovery — around the clock.",
        pains: ["Customer support tickets pile up during peak seasons", "Abandoned carts lose 70% of potential revenue", "'Where is my order?' emails consume your entire support team", "Product questions go unanswered and kill conversions", "Returns and exchanges are a manual, error-prone process", "You can't afford 24/7 support staff"],
        solutions: [
            { icon: "💬", title: "24/7 Customer Support", desc: "AI answers product questions, tracks orders, and handles returns instantly. No wait times." },
            { icon: "🛒", title: "Cart Recovery", desc: "Personalized follow-ups for abandoned carts via email and chat. Recovers up to 25% of lost sales." },
            { icon: "🎁", title: "Product Recommendations", desc: "AI suggests relevant products based on browsing history and purchase patterns." },
            { icon: "📦", title: "Order Tracking", desc: "Customers get instant order status without contacting support. Integrates with Shopify and WooCommerce." },
            { icon: "🔄", title: "Returns Automation", desc: "AI processes return requests, generates labels, and updates inventory automatically." },
            { icon: "📊", title: "Sales Analytics", desc: "Track conversion rates, support satisfaction, and revenue recovered by your AI." },
        ],
        stats: [{ v: "25%", l: "Cart Recovery" }, { v: "90%", l: "Tickets Resolved" }, { v: "$0", l: "After-Hours Cost" }],
        testimonial: { quote: "Our AI agent handles 90% of support tickets and recovered $47K in abandoned cart revenue in the first month.", name: "Lisa Chen", role: "Founder, DTC Fashion Brand" },
        cta: "Automate Your Store",
    },
    {
        slug: "saas-companies", industry: "SaaS Companies", emoji: "💻",
        headline: 'Reduce Churn and Scale Support with <span class="gradient-text">AI Agents</span>',
        sub: "Your AI handles onboarding, feature questions, bug reports, and proactive retention outreach — so your team builds product.",
        pains: ["Support tickets grow 3x faster than your team", "User onboarding drop-off kills your activation rate", "Feature requests and bug reports get lost in email", "Churn happens silently — you find out when it's too late", "Documentation is outdated and users can't find answers", "Engineers spend time on support instead of shipping"],
        solutions: [
            { icon: "🎓", title: "Onboarding Agent", desc: "AI guides new users through setup, answers questions in context, and ensures they reach activation milestones." },
            { icon: "🔧", title: "Support Agent", desc: "Answers feature questions using your docs. Routes bugs to engineering with full context." },
            { icon: "📉", title: "Churn Prevention", desc: "Detects usage drops and proactively reaches out to at-risk users before they cancel." },
            { icon: "📋", title: "Feature Requests", desc: "AI categorizes and prioritizes feature requests. Auto-notifies users when their request ships." },
            { icon: "📚", title: "Smart Docs", desc: "Users ask questions in natural language. AI finds the answer across your entire knowledge base." },
            { icon: "🔗", title: "Integrations", desc: "Connects to Intercom, Zendesk, Slack, Linear, Jira, and your product API." },
        ],
        stats: [{ v: "40%", l: "Less Churn" }, { v: "85%", l: "Auto-Resolved" }, { v: "10x", l: "Support Scale" }],
        testimonial: { quote: "We cut our churn rate by 40% in 3 months. The AI catches disengaged users before they leave.", name: "Priya S.", role: "Head of Growth, B2B SaaS" },
        cta: "Scale Your SaaS Support",
    },
    {
        slug: "personal-trainers", industry: "Personal Trainers", emoji: "💪",
        headline: 'Train More Clients <span class="gradient-text">Without More Hours</span>',
        sub: "Your AI agent handles bookings, client check-ins, workout reminders, and new lead qualification — so you stay focused on training.",
        pains: ["Spending hours scheduling and rescheduling sessions", "New leads message you but you're mid-session and can't reply", "Client check-ins between sessions fall through the cracks", "No-shows waste your valuable time slots", "Managing multiple clients' programs across spreadsheets", "Difficult to grow beyond your physical time limits"],
        solutions: [
            { icon: "📅", title: "Auto-Scheduling", desc: "Clients book, reschedule, and cancel sessions through your AI. No back-and-forth texts." },
            { icon: "⚡", title: "Instant Lead Response", desc: "New inquiries get qualified immediately. Your AI asks about goals, experience, and availability." },
            { icon: "💬", title: "Client Check-ins", desc: "Automated daily/weekly check-ins on nutrition, workouts, and progress. You review summaries." },
            { icon: "🔔", title: "Reminders & No-Shows", desc: "Automatic session reminders reduce no-shows by 60%. Waitlist fills cancelled slots." },
            { icon: "📊", title: "Progress Tracking", desc: "Clients log workouts and meals. AI tracks trends and flags when someone's falling off." },
            { icon: "📧", title: "Retention Engine", desc: "Nurture lapsed clients with personalized win-back messages based on their goals." },
        ],
        stats: [{ v: "2x", l: "Client Capacity" }, { v: "60%", l: "Fewer No-Shows" }, { v: "0", l: "Admin Hours" }],
        testimonial: { quote: "I went from 15 to 30 clients without hiring help. My AI handles all the scheduling and check-ins.", name: "Mike D.", role: "Certified Personal Trainer" },
        cta: "Automate Your Training Business",
    },
    {
        slug: "fitness-coaches", industry: "Fitness Coaches", emoji: "🏋️",
        headline: 'Scale Your Fitness Coaching with <span class="gradient-text">AI-Powered Automation</span>',
        sub: "From online programs to in-person sessions — your AI agent handles client management, program delivery, and community engagement.",
        pains: ["Can't scale your online coaching beyond manual effort", "Program delivery relies on you sending PDFs and spreadsheets", "Community engagement drops off after the first week", "Nutrition and accountability tracking is inconsistent", "Spending more time on admin than coaching", "Revenue plateaus because you've maxed out your hours"],
        solutions: [
            { icon: "📋", title: "Program Delivery", desc: "AI delivers daily workouts and nutrition plans. Adapts based on client progress and feedback." },
            { icon: "💬", title: "Accountability Agent", desc: "Daily check-ins, habit tracking, and motivational nudges — all automated, all personalized." },
            { icon: "🎯", title: "Lead Qualification", desc: "AI qualifies new leads by goals, fitness level, and budget. Books consults with qualified prospects only." },
            { icon: "🤝", title: "Community Manager", desc: "AI moderates your community, answers common questions, and keeps engagement high." },
            { icon: "📊", title: "Client Analytics", desc: "Track adherence, progress photos, measurements, and satisfaction scores across all clients." },
            { icon: "💰", title: "Revenue Growth", desc: "Upsell existing clients to premium programs. Re-engage past clients with targeted campaigns." },
        ],
        stats: [{ v: "5x", l: "More Clients" }, { v: "90%", l: "Adherence Rate" }, { v: "$10K+", l: "MRR Potential" }],
        testimonial: { quote: "I launched my online coaching program and scaled to 200 clients in 3 months. The AI handles everything between our weekly check-ins.", name: "Tanya R.", role: "Online Fitness Coach" },
        cta: "Scale Your Fitness Coaching",
    },
    {
        slug: "roofing", industry: "Roofing Companies", emoji: "🏗️",
        headline: 'Never Miss a Roofing Lead <span class="gradient-text">Again</span>',
        sub: "Your AI agent answers calls, qualifies storm damage inquiries, books estimates, and follows up with homeowners — while your crew is on the roof.",
        pains: ["Missing calls while your team is on job sites", "Storm season overwhelms your phone lines", "Leads from Google and Angi expire before you can respond", "Following up with estimates is manual and inconsistent", "Scheduling inspections across multiple crews is a nightmare", "Competitors respond faster and steal your leads"],
        solutions: [
            { icon: "📞", title: "AI Receptionist", desc: "Never miss a call. Your AI answers, qualifies the lead, and books an inspection — even at 11pm." },
            { icon: "🌪️", title: "Storm Response", desc: "Handle surges in call volume during storm season. AI qualifies damage claims and prioritizes emergency calls." },
            { icon: "📅", title: "Estimate Scheduling", desc: "AI matches homeowner availability with your crew schedules. Sends confirmations and reminders." },
            { icon: "📧", title: "Estimate Follow-Up", desc: "Automated follow-up after every estimate. AI handles objections and drives approval." },
            { icon: "⭐", title: "Review Collection", desc: "After job completion, AI requests reviews on Google and Yelp. Builds your reputation on autopilot." },
            { icon: "📊", title: "Lead Pipeline", desc: "See every lead, estimate, and job status in one dashboard. Know your close rate in real-time." },
        ],
        stats: [{ v: "100%", l: "Calls Answered" }, { v: "3x", l: "More Estimates" }, { v: "40%", l: "Higher Close Rate" }],
        testimonial: { quote: "During last year's hail storm, our AI handled 200+ calls in one day. We booked 80 inspections without hiring temporary staff.", name: "Tony B.", role: "Owner, Premier Roofing Co." },
        cta: "Automate Your Roofing Business",
    },
    {
        slug: "plumbing", industry: "Plumbing Companies", emoji: "🔧",
        headline: 'Your Plumbing Business, <span class="gradient-text">Always On</span>',
        sub: "AI agent that handles emergency calls, schedules service appointments, sends quotes, and follows up with customers — even at 2am.",
        pains: ["Emergency calls at 2am go to voicemail and you lose the job", "Can't answer the phone when you're elbow-deep in a repair", "Scheduling across multiple technicians is chaos", "Customers call 3 competitors — whoever answers first wins", "Quoting takes too long and customers move on", "No time for marketing or follow-up when you're running jobs"],
        solutions: [
            { icon: "🚨", title: "24/7 Emergency Line", desc: "AI triages emergency calls, dispatches your on-call tech, and gives homeowners real-time ETAs." },
            { icon: "📅", title: "Smart Scheduling", desc: "Books appointments based on tech location, skill, and availability. Optimizes routes automatically." },
            { icon: "💰", title: "Instant Quotes", desc: "AI provides ballpark quotes for common jobs and schedules on-site estimates for complex work." },
            { icon: "📞", title: "Call Answering", desc: "Every call gets answered on the first ring. AI qualifies the job type and urgency." },
            { icon: "⭐", title: "Review Automation", desc: "Happy customers get review requests automatically. Unhappy ones get routed to you for resolution." },
            { icon: "📊", title: "Business Dashboard", desc: "Track jobs, revenue, tech utilization, and customer satisfaction in real-time." },
        ],
        stats: [{ v: "100%", l: "Calls Answered" }, { v: "< 60s", l: "Response Time" }, { v: "50%", l: "More Jobs" }],
        testimonial: { quote: "We went from losing 40% of calls to a 100% answer rate. Revenue jumped 50% in the first quarter.", name: "Dave R.", role: "Owner, Fast Flow Plumbing" },
        cta: "Automate Your Plumbing Business",
    },
    {
        slug: "electricians", industry: "Electricians", emoji: "⚡",
        headline: 'Power Up Your Electrical Business with <span class="gradient-text">AI Agents</span>',
        sub: "Your AI handles calls, books service appointments, sends quotes, and manages your schedule — so you focus on the work that pays.",
        pains: ["Missing calls on job sites costs you thousands per month", "Residential and commercial inquiries need different handling", "Scheduling across emergency and planned jobs is complex", "Permit and inspection coordination is time-consuming", "Customers want instant quotes but you're too busy to respond", "Follow-up on quotes and proposals falls behind"],
        solutions: [
            { icon: "📞", title: "Always-On Answering", desc: "AI answers every call, distinguishes emergency from routine, and schedules accordingly." },
            { icon: "⚡", title: "Emergency Dispatch", desc: "Electrical emergencies get priority routing. AI dispatches the nearest available tech." },
            { icon: "💰", title: "Quote Generation", desc: "AI provides estimates for standard jobs and schedules site visits for complex work." },
            { icon: "📅", title: "Smart Scheduling", desc: "Manages your calendar across residential, commercial, and emergency jobs. Minimizes drive time." },
            { icon: "📋", title: "Job Management", desc: "Track active jobs, parts ordered, inspections scheduled, and customer approvals in one place." },
            { icon: "⭐", title: "Reputation Builder", desc: "Automatic review requests after every completed job. Monitors and responds to reviews." },
        ],
        stats: [{ v: "100%", l: "Answer Rate" }, { v: "2x", l: "Booked Jobs" }, { v: "30%", l: "Revenue Increase" }],
        testimonial: { quote: "The AI handles my phones better than any receptionist I've ever hired. My schedule has never been this organized.", name: "Chris L.", role: "Master Electrician, Spark Electric" },
        cta: "Automate Your Electrical Business",
    },
    {
        slug: "cleaners", industry: "Cleaning Companies", emoji: "✨",
        headline: 'Clean Up Your Business Operations with <span class="gradient-text">AI Automation</span>',
        sub: "Your AI agent handles booking requests, coordinates cleaning crews, sends reminders, and collects reviews — on complete autopilot.",
        pains: ["Booking requests come in all day but you can't always answer", "Scheduling multiple crews across different locations is chaos", "Clients forget appointments and cancel last-minute", "Following up for recurring service falls on your plate", "Quality control relies on your personal spot-checks", "Growing past a handful of crews feels impossible"],
        solutions: [
            { icon: "📅", title: "Instant Booking", desc: "Clients book online or by phone. AI checks crew availability and confirms instantly." },
            { icon: "👥", title: "Crew Management", desc: "AI assigns crews based on location, availability, and client preferences. Notifies crews automatically." },
            { icon: "🔔", title: "Reminders & Confirmations", desc: "Clients and crews get reminders. Last-minute cancellations trigger waitlist fills." },
            { icon: "🔄", title: "Recurring Service", desc: "AI manages weekly, bi-weekly, and monthly schedules. Handles reschedules without your input." },
            { icon: "✅", title: "Quality Tracking", desc: "Post-service surveys catch issues early. AI follows up on any low ratings immediately." },
            { icon: "📊", title: "Growth Dashboard", desc: "Track bookings, revenue per crew, client retention, and growth metrics." },
        ],
        stats: [{ v: "3x", l: "More Bookings" }, { v: "90%", l: "Retention Rate" }, { v: "0hrs", l: "Scheduling Time" }],
        testimonial: { quote: "I went from 2 crews to 8 in six months. The AI manages everything — bookings, scheduling, reminders, and reviews.", name: "Maria S.", role: "Owner, Sparkle Pro Cleaning" },
        cta: "Automate Your Cleaning Business",
    },
];

function generatePage(niche) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agents for ${niche.industry} — KaizenAI</title>
    <meta name="description" content="${niche.sub.replace(/"/g, '&quot;')}">
    <meta name="keywords" content="AI agents, ${niche.industry}, business automation, ${niche.slug}">
    <meta property="og:title" content="AI Agents for ${niche.industry} — KaizenAI">
    <meta property="og:description" content="${niche.sub.replace(/"/g, '&quot;')}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://kaizenai.agency/for/${niche.slug}">
    <link rel="canonical" href="https://kaizenai.agency/for/${niche.slug}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/niche.css">
</head>
<body class="niche-page">
    <!-- Nav -->
    <nav id="navbar">
        <div class="nav-container">
            <a href="/" class="logo">
                <span class="logo-icon">⚡</span>
                <span class="logo-text">Kaizen<span class="accent">AI</span></span>
            </a>
            <div class="nav-links">
                <a href="/#pricing">Pricing</a>
                <a href="https://app.kaizenai.agency/signup?niche=${niche.slug}" class="nav-cta">Get Started Free</a>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="niche-hero">
        <div class="hero-bg">
            <div class="grid-overlay"></div>
            <div class="glow glow-1"></div>
            <div class="glow glow-2"></div>
        </div>
        <div class="niche-hero-content">
            <span class="niche-emoji">${niche.emoji}</span>
            <div class="niche-badge">AI Agents for ${niche.industry}</div>
            <h1>${niche.headline}</h1>
            <p class="hero-subtitle">${niche.sub}</p>
            <div class="hero-actions">
                <a href="https://app.kaizenai.agency/signup?niche=${niche.slug}" class="btn btn-primary">
                    <span>${niche.cta} →</span>
                </a>
                <a href="/#pricing" class="btn btn-ghost">View Pricing</a>
            </div>
            <div class="niche-stats">
                ${niche.stats.map(s => `<div class="stat"><span class="stat-value">${s.v}</span><span class="stat-label">${s.l}</span></div>`).join('\n                ')}
            </div>
        </div>
    </section>

    <!-- Pain Points -->
    <section class="niche-pain">
        <div class="container">
            <h2>Sound <span class="gradient-text">Familiar</span>?</h2>
            <p class="subtitle">These are the problems ${niche.industry.toLowerCase()} face every day.</p>
            <div class="pain-grid">
                ${niche.pains.map(p => `<div class="pain-item"><span class="pain-x">✗</span><span class="pain-text">${p}</span></div>`).join('\n                ')}
            </div>
        </div>
    </section>

    <!-- Solutions -->
    <section class="niche-solutions">
        <div class="container">
            <h2>How KaizenAI <span class="gradient-text">Solves This</span></h2>
            <p class="subtitle">Your AI agent handles it all — 24/7, no breaks, no mistakes.</p>
            <div class="solutions-grid">
                ${niche.solutions.map(s => `<div class="solution-card">
                    <span class="solution-icon">${s.icon}</span>
                    <h3>${s.title}</h3>
                    <p>${s.desc}</p>
                </div>`).join('\n                ')}
            </div>
        </div>
    </section>

    <!-- Testimonial -->
    <section class="niche-testimonial">
        <div class="container">
            <div class="testimonial-icon">💬</div>
            <blockquote class="testimonial-quote">"${niche.testimonial.quote}"</blockquote>
            <div class="testimonial-name">${niche.testimonial.name}</div>
            <div class="testimonial-role">${niche.testimonial.role}</div>
        </div>
    </section>

    <!-- CTA -->
    <section class="niche-cta">
        <h2>Ready to <span class="gradient-text">Automate</span> Your ${niche.industry}?</h2>
        <p>Deploy your AI agent in 10 minutes. Start free — no credit card required.</p>
        <a href="https://app.kaizenai.agency/signup?niche=${niche.slug}" class="btn btn-primary">
            <span>${niche.cta} →</span>
        </a>
    </section>

    <!-- Footer -->
    <footer id="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2026 KaizenAI Agency. AI agents for ${niche.industry.toLowerCase()}.</p>
            </div>
        </div>
    </footer>

    <script src="/chatbot.js"></script>
</body>
</html>`;
}

// Create directories and generate pages
const dir = path.join(__dirname, 'for');
niches.forEach(niche => {
    const nicheDir = path.join(dir, niche.slug);
    fs.mkdirSync(nicheDir, { recursive: true });
    fs.writeFileSync(path.join(nicheDir, 'index.html'), generatePage(niche));
    console.log(`✅ Generated: /for/${niche.slug}/index.html`);
});

console.log(`\n🎉 Generated ${niches.length} niche landing pages!`);
