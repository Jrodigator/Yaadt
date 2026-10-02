document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate Starry Background
    const generateStars = (n) => {
        let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
        for (let i = 2; i <= n; i++) {
            value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
        }
        return value;
    };

    const style = document.createElement('style');
    style.innerHTML = `
        #stars { width: 1px; height: 1px; box-shadow: ${generateStars(700)}; animation: animStar 150s linear infinite; opacity: 0.5; }
        #stars::after { content: " "; position: absolute; top: 2000px; width: 1px; height: 1px; box-shadow: ${generateStars(700)}; }
        #stars2 { width: 2px; height: 2px; box-shadow: ${generateStars(200)}; animation: animStar 200s linear infinite; opacity: 0.3; }
        #stars2::after { content: " "; position: absolute; top: 2000px; width: 2px; height: 2px; box-shadow: ${generateStars(200)}; }
        #stars3 { width: 3px; height: 3px; box-shadow: ${generateStars(100)}; animation: animStar 250s linear infinite; opacity: 0.2; }
        #stars3::after { content: " "; position: absolute; top: 2000px; width: 3px; height: 3px; box-shadow: ${generateStars(100)}; }
        @keyframes animStar { from { transform: translateY(0px); } to { transform: translateY(-2000px); } }
    `;
    document.head.appendChild(style);

    // 2. Inject Sidebar Navigation (if not landing page)
    if (!document.body.classList.contains('landing')) {
        const sidebarHTML = `
            <div class="sidebar-header mono">
                <a href="index.html" style="color: inherit; text-decoration: none;"><h2>YAADT ARCHIVE</h2></a>
                <div class="status">STATUS: <span style="color: var(--text-color)">ACTIVE</span></div>
            </div>
            <ul class="tree-nav mono">
                <li><a href="archive.html">INDEX</a></li>
                <li><span class="folder">HISTORY</span>
                    <ul>
                        <li><a href="origins.html">The Origins of Yaadt</a></li>
                        <li><a href="history.html">Timeline</a></li>
                    </ul>
                </li>
                <li><span class="folder">DATABASE</span>
                    <ul>
                        <li><a href="people.html">People</a></li>
                        <li><a href="places.html">Places</a></li>
                    </ul>
                </li>
                <li><span class="folder">DOCUMENTS</span>
                    <ul>
                        <li><a href="documents.html">Directory</a></li>
                        <li><a href="yaadtstitution.html">The Yaadtstitution</a></li>
                    </ul>
                </li>
                <li><span class="folder">INTERACTIVE</span>
                    <ul>
                        <li><a href="game.html">Yaadt or Not Yaadt?</a></li>
                        <li><a href="generator.html">Yaadt Generator</a></li>
                    </ul>
                </li>
            </ul>
            <div style="position: absolute; bottom: 30px; font-size: 0.75rem; color: var(--text-muted); opacity: 0.5;">
                UNIVERSE V1.0.4<br>
                <span style="font-size: 0.6rem; cursor: pointer;" onclick="alert('System intact.')">CHECK INTEGRITY</span>
            </div>
        `;
        const sidebar = document.createElement('nav');
        sidebar.id = 'sidebar';
        sidebar.innerHTML = sidebarHTML;
        document.body.insertBefore(sidebar, document.body.firstChild);
        
        // Highlight active link
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const links = sidebar.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Add mobile menu toggle
        const menuToggle = document.createElement('button');
        menuToggle.id = 'mobile-menu-toggle';
        menuToggle.className = 'mono';
        menuToggle.innerHTML = '☰ MENU';
        document.body.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if(sidebar.classList.contains('open')) {
                menuToggle.innerHTML = '✕ CLOSE';
            } else {
                menuToggle.innerHTML = '☰ MENU';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
                sidebar.classList.remove('open');
                menuToggle.innerHTML = '☰ MENU';
            }
        });
    }

    // 3. Scroll Reveal Logic
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.story-content p, .countdown, .explosion, blockquote, .inevitable, .timeline-event, .card');
    elementsToReveal.forEach((el, index) => {
        if (index < 3 && el.tagName === 'P') el.style.transitionDelay = `${0.1 * index}s`;
        observer.observe(el);
    });

    // 4. Game Logic: Yaadt or Not Yaadt
    const gameStatementEl = document.getElementById('game-statement');
    if (gameStatementEl) {
        const questions = [
            { text: "The Great Yaadt Schism began because two historians disagreed about the correct number of Yaadts.", isYaadt: true },
            { text: "Yaadt Space is located precisely three meters to the left of normal space.", isYaadt: true },
            { text: "The First Yaadt was a man named Greg who worked in accounting.", isYaadt: false },
            { text: "The Yaadt Constitution has a clause requiring all arguments to end with a staring contest.", isYaadt: true },
            { text: "The Golden Yaadt is made entirely of bronze.", isYaadt: false },
            { text: "The Yaadt Department of Transport primarily manages the deployment of traffic cones.", isYaadt: true },
            { text: "Yaadtenomics is based on the exchange of bewildered glances.", isYaadt: true },
            { text: "A 'Yaadtastrophe' is officially defined as any event involving more than three Yaadts and a rotating object.", isYaadt: true }
        ];
        
        // Shuffle questions
        questions.sort(() => Math.random() - 0.5);

        let currentQ = 0;
        let score = 0;
        let streak = 0;

        const loadQuestion = () => {
            if (currentQ >= questions.length) {
                endGame();
                return;
            }
            gameStatementEl.style.opacity = 0;
            setTimeout(() => {
                gameStatementEl.textContent = '"' + questions[currentQ].text + '"';
                gameStatementEl.style.opacity = 1;
            }, 300);
        };

        const handleAnswer = (userSaidYaadt) => {
            const correct = questions[currentQ].isYaadt === userSaidYaadt;
            if (correct) {
                score++;
                streak++;
            } else {
                streak = 0;
            }
            document.getElementById('game-score').textContent = `SCORE: ${score} | STREAK: ${streak}`;
            currentQ++;
            loadQuestion();
        };

        const endGame = () => {
            document.querySelector('.game-buttons').style.display = 'none';
            gameStatementEl.style.display = 'none';
            const resultEl = document.getElementById('game-result');
            resultEl.style.display = 'block';
            
            let rank = "YAADT NOVICE";
            if (score === questions.length) rank = "THEY KNEW TOO MUCH";
            else if (score >= 6) rank = "HIGH YAADT";
            else if (score >= 4) rank = "CERTIFIED YAADT HISTORIAN";
            else if (score >= 2) rank = "ARCHIVE INTERN";
            
            resultEl.innerHTML = `FINAL SCORE: ${score}/${questions.length}<br><br>CLASSIFICATION:<br><span>${rank}</span>`;
        };

        document.getElementById('btn-yaadt').addEventListener('click', () => handleAnswer(true));
        document.getElementById('btn-not-yaadt').addEventListener('click', () => handleAnswer(false));
        
        loadQuestion();
    }

    // 5. Generator Logic
    const btnGenerate = document.getElementById('btn-generate');
    if (btnGenerate) {
        const names = ["Gerald Yaadtson", "The Anonymous Yaadt", "Minister Y.", "Professor Yaadt", "Darth Yaadter", "The Second Yaadt", "Archduke of Yaadt"];
        const titles = ["Assistant Minister of Secondary Yaadt Affairs", "Chief Yaadt Historian", "Keeper of the Golden Yaadt", "Uncertified Yaadtronaut", "Head of Yaadtenomics", "Supreme Overlord of Traffic Cones"];
        const eras = ["The Pre-Yaadt Era", "The First Yaadt Age", "The Great Yaadt Schism", "The Second Yaadt Age", "The Modern Yaadt Period", "Unknown"];
        const alignments = ["Unclear", "Pro-Yaadt", "Anti-Yaadt (Controversial)", "Chaotic Yaadt", "Strictly Bureaucratic", "Confused"];
        const significances = ["Extremely disputed", "Historically vital", "Negligible", "Classified", "Unknown, but likely terrible", "Monumental"];
        const knownFor = ["The Incident of 1987", "Inventing the Yaadt Accords", "Crashing the Yaadt Shuttle", "Staring at a wall for 12 years", "Redacting their own birth certificate", "Stealing the Yaadt Census"];

        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

        btnGenerate.addEventListener('click', () => {
            document.getElementById('gen-name').textContent = rand(names);
            document.getElementById('gen-title').textContent = rand(titles);
            document.getElementById('gen-era').textContent = rand(eras);
            document.getElementById('gen-alignment').textContent = rand(alignments);
            document.getElementById('gen-significance').textContent = rand(significances);
            document.getElementById('gen-known').textContent = rand(knownFor);
            
            const entity = document.getElementById('generated-entity');
            entity.style.opacity = 0;
            setTimeout(() => {
                entity.style.opacity = 1;
            }, 100);
        });
        
        btnGenerate.click(); // init
    }
});
