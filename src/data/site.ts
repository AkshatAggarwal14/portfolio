// Site content: profile, work, posts, and resume data. Mirrors resume.tex. Edit here to make it yours.
export const site = {
  name: 'Akshat Aggarwal',
  initials: 'AA',
  role: 'Software Engineer 2 at Intuit',
  description: 'Akshat Aggarwal, Software Engineer working on distributed systems, data platforms, and reliable APIs.',
  intro: 'I work on enterprise-scale distributed systems and data platforms. I care about simple design, reliable systems, and software that quietly does its job well.',
  email: 'contact@akshataggarwal.is-a.dev',
  resumeSite: 'https://akshataggarwal14.github.io/resume/',
  socials: [
    { name: 'GitHub', handle: 'AkshatAggarwal14', url: 'https://github.com/AkshatAggarwal14', icon: 'github' },
    { name: 'LinkedIn', handle: 'akshataggarwal1411', url: 'https://linkedin.com/in/akshataggarwal1411', icon: 'linkedin' },
    { name: 'X / Twitter', handle: 'akshat14agg', url: 'https://x.com/akshat14agg', icon: 'x' },
  ],
  now: 'Building enterprise data and authorization systems at Intuit, and keeping this space a calm record of the work.',
  tools: [
    { label: 'Languages', items: ['Java', 'Go', 'Kotlin', 'TypeScript', 'Python', 'C/C++', 'SQL', 'GraphQL'] },
    { label: 'Frameworks', items: ['React', 'Spring Boot', 'Node.js', 'Express', 'FastAPI'] },
    { label: 'Databases & messaging', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka'] },
    { label: 'Tools & platforms', items: ['AWS', 'Docker', 'Kubernetes', 'Gatling', 'Playwright', 'Git'] },
  ],
  // Projects now live as Markdown in src/content/projects/. The work page says "Coming soon" if empty.
  resume: {
    summary: 'Software Engineer 2 at Intuit, working on enterprise-scale distributed systems and data platforms. B.Tech, Computer Science from NIT Hamirpur (Gold Medalist, Class of 2024). Interested in high-throughput APIs, reliability, and clear, maintainable design.',
    experience: [
      { company: 'Intuit', location: 'Bengaluru, India', url: 'https://erp.intuit.com', roles: [
        { role: 'Software Engineer 2', period: 'Feb 2026 - Present', details: ['Built an AI-assisted workflow for reviewing, editing, and bulk-applying data recommendations, combining centralized React state management with high-throughput Kafka consumers and outbox event patterns.', 'Engineered an event-driven pipeline using standardized System Objects (vertical schemas) to ingest third-party data and auto-provision analytics infra from schema events, cutting app onboarding to Intuit Enterprise Suite from months to weeks.', "Pioneered Intuit's first dynamic RBAC implementation, enabling user-created custom objects to self-register as authorization resources with granular, per-object CRUD permissions.", 'Spearheaded an automated lifecycle engine processing ~4,500 entities/month, eliminating recurring customer support inquiries and reducing operational support toil by ~90% (from ~50 to 4–5 tickets/month).'] },
        { role: 'Software Engineer 1', period: 'Aug 2024 - Jan 2026', details: ['Delivered end-to-end multi-entity capabilities across Java, Kotlin, GraphQL, and React, enabling consolidated enterprise systems to seamlessly manage shared business entities across multi-company deployments.', 'Co-led bulk metadata tagging across transaction line items, eliminating repetitive manual workflows and driving a 7× increase in feature engagement.', 'Shipped AI-assisted recommendation services for high-volume financial transaction forms, driving 33% of user interactions post-launch.', 'Launched a secure self-service database access platform featuring read-only DB access, query validation, and audit guardrails to accelerate production data-fix verification and incident response.'] },
      ] },
      { company: 'Salesforce', location: 'Bengaluru, India', url: 'https://www.salesforce.com', roles: [
        { role: 'Associate Member of Technical Staff', period: 'Jun 2024 - Aug 2024', details: ['Onboarding documentation and developer guide contributions for Industries Cloud.'] },
      ] },
      { company: 'Cisco', location: 'Bengaluru, India', url: 'https://www.cisco.com', roles: [
        { role: 'Software Engineer Intern', period: 'Jan 2024 - May 2024', details: ['Contributed to core cloud security microservices for Secure Cloud Control (SCC v2) within the XDR team.', 'Built automated unit, integration, and performance tests using Jest and Playwright, maintaining at least 90% code coverage.', 'Automated event notifications via Webex APIs and integrated micro-apps using Webpack Module Federation.', 'Diagnosed and resolved production bugs across internal core libraries and distributed cloud UI components.'] },
      ] },
      { company: 'Scaler', location: 'Remote', url: 'https://www.scaler.com', roles: [
        { role: 'Problem Setter Intern', period: 'Sep 2023 - Dec 2023', details: ['Curated and reviewed problems for hiring challenges and InterviewBit.'] },
      ] },
      { company: 'Coding Ninjas', location: 'Remote', url: 'https://www.codingninjas.com', roles: [
        { role: 'Technical Content Writer Intern', period: 'Mar 2023 - Jun 2023', details: ['Wrote and edited <a href="https://www.naukri.com/code360/profile/AkshatAggarwal" target="_blank" rel="noopener noreferrer">30+ technical posts</a> and tutorials across Python, DBMS, C, DSA, and web development (e.g. Python memory management, SQL primary vs unique keys, tree applications, CSS layouts), each with runnable code, visuals, and FAQs, helping students learn and excel.'] },
      ] },
      { company: 'Coding Shuttle', location: 'Remote', url: 'https://www.codingshuttle.com', roles: [
        { role: 'Problem Setter', period: 'Feb 2023 - Mar 2023', details: ['Wrote DSA test cases and optimal solutions.'] },
      ] },
    ],
    community: [
      { org: 'CSEC, NIT Hamirpur', url: 'https://csec.nith.ac.in', roles: [
        { role: 'Coordinator', period: '2022 - 2023', details: 'Designed problems for monthly programming contests and conducted programming meets.' },
        { role: 'Executive Member', period: '2021', details: 'Contributed to club events and technical initiatives.' },
        { role: 'Volunteer', period: '2020', details: 'Volunteered for club events and workshops.' },
      ] },
      { org: 'CodeChef NIT Hamirpur Chapter', url: 'https://www.codechef.com', roles: [
        { role: 'Competitive Programming Lead', period: 'Jul 2021 - Jan 2022', details: 'Led the campus CodeChef chapter: conducted programming contests and workshops with 100+ attendees each.', cert: 'https://www.codechef.com/certificates/public/e29be41' },
      ] },
      { org: 'Robotics Society, NIT Hamirpur', url: 'https://www.robosocnith.in/', roles: [
        { role: 'Executive', period: 'Dec 2020 - Jul 2022', details: 'Used Arduino to design and develop projects containing both hardware and software components.' },
      ] },
      { org: 'GNU/Linux Users Group (GLUG), NIT Hamirpur', url: 'https://glugnith.github.io/', roles: [
        { role: 'Member', period: 'Dec 2020 - Jul 2024', details: 'Member of the campus GNU/Linux users group.' },
      ] },
    ],
    projects: [
      { name: 'RFID Attendance System', stack: 'Node.js / Arduino', url: 'https://github.com/AkshatAggarwal14/RFID-Attendance-system', details: ['RFID card-scanning attendance with serial communication between Arduino and Node.js.'] },
      { name: 'Sort Visualizer', stack: 'p5.js / HTML / CSS', url: 'https://github.com/AkshatAggarwal14/Sorting-Algorithms', demo: 'https://akshataggarwal14.github.io/Sorting-Algorithms/', details: ['Interactive sorting visualizations with adjustable size and speed.'] },
      { name: 'React Wordle', stack: 'React / CSS', url: 'https://github.com/AkshatAggarwal14/react-wordle', demo: 'https://wordle-with-react.netlify.app/', details: ['Word-guessing game with animations and responsive design.'] },
    ],
    skills: [
      { label: 'Languages', items: ['Java', 'Go', 'Kotlin', 'TypeScript', 'Python', 'C/C++', 'SQL', 'GraphQL'] },
      { label: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
      { label: 'Frameworks', items: ['React', 'Spring Boot', 'Node.js', 'Express', 'FastAPI'] },
      { label: 'Tools', items: ['AWS', 'Kafka', 'Docker', 'Kubernetes', 'Gatling', 'Playwright', 'Git'] },
      { label: 'Core', items: ['Distributed Systems', 'Microservices', 'High-Throughput APIs', 'SRE / On-call', 'DBMS', 'Operating Systems'] },
    ],
    achievements: [
      { title: 'ICPC 2023 Regionalist', detail: 'with team Deadlock', period: 'Dec 2023', url: 'https://icpc.global/ICPCID/6IIRHHSFPAXF' },
      { title: 'Code with Cisco finalist', detail: 'top 23 of 60,000+ participants', period: 'Jul 2023', url: 'https://drive.google.com/file/d/1eBcJ4Ax0QHJq6Kb9MObrU1M9dQ7qvvbI/view?usp=sharing' },
    ],
    education: [
      { title: 'B.Tech, Computer Science & Engineering', institution: 'National Institute of Technology, Hamirpur · Himachal Pradesh, India', url: 'https://nith.ac.in', detail: 'CGPA: 9.66/10 · Gold Medalist, Class of 2024', period: '2020 - 2024' },
      { title: 'Intermediate in Mathematics, Physics, and Chemistry', institution: "The Scholars' Home · Paonta Sahib, India", detail: 'Percentage: 97%', period: '2019 - 2020' },
      { title: 'Matriculation', institution: "The Scholars' Home · Paonta Sahib, India", detail: 'Percentage: 94.4%', period: '2017 - 2018' },
    ],
  },
};
