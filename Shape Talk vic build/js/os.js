// OS Shell + Window Manager + Apps Registry (single-page, no navigation)
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const OS = {
    zTop: 100,
    windows: new Map(),
    taskbarItems: new Map(),
    activeWindowId: null,
    root: null,
    taskbar: null,
    launcherToggle: null,
    launcherMenu: null,
    internetUnblocked: false,
    stolenIdeasLog: [],
    launcherPalettes: [
      ['#1E88E5', '#43A047'],
      ['#E53935', '#1E88E5'],
      ['#FDD835', '#E53935'],
      ['#43A047', '#FDD835']
    ],

    config: {
      videos: [],
      pictures: [],
      recycleBin: [
        { name: 'SUPER_TOP_SECRET_PASSWORD_TO_GET_THE_SUPER_TOP_SECRET_INFORMATION_THAT_YOU_HAVE_BEEN_LOOKING_FOR_THIS_IS_THE_ANSWER_RIGHT_HERE.txt', type: 'text', deletedAt: '03/15/2026', thumb: null }
      ]
    },

    apps: {
      internet: {
        id: 'internet',
        name: 'Internet',
        icon: 'WWW',
        taskbarIcon: 'taskbar-shape-square',
        defaultSize: { w: 700, h: 480 },
        render: () => {
          if (!OS.internetUnblocked) {
            const container = document.createElement('div');
            container.className = 'app-internet';
            container.innerHTML = `
              <div class="net-warning">
                <div class="net-warning-title">ACCESS BLOCKED</div>
                <div class="net-warning-text" id="netWarningText">Your internet access has been revoked for using an inauthentic shrimp card.</div>
                <div class="net-warning-actions">
                  <button class="net-btn" type="button" disabled>Proceed</button>
                  <button class="net-btn" type="button" disabled>Retry</button>
                </div>
                <div class="net-noise" aria-hidden="true"></div>
              </div>
            `;
            return container;
          }

          // ── Browser UI ──
          const container = document.createElement('div');
          container.className = 'app-browser';
          container.innerHTML = `
            <div class="browser-bar">
              <button class="browser-nav-btn" type="button" data-action="back" title="Back">&#8592;</button>
              <button class="browser-nav-btn" type="button" data-action="fwd" title="Forward">&#8594;</button>
              <input class="browser-url-input" type="text" spellcheck="false" placeholder="type a domain and press Enter..." data-el="urlInput">
              <button class="browser-go-btn" type="button" data-action="go">GO</button>
            </div>
            <div class="browser-content" data-el="content"></div>
          `;

          const urlInput = container.querySelector('[data-el="urlInput"]');
          const content  = container.querySelector('[data-el="content"]');
          const hist = [];
          let histIdx = -1;

          const norm = (raw) => (raw || '').trim().toLowerCase()
            .replace(/^https?:\/\//, '').replace(/\/$/, '');

          const navigate = (raw, push = true) => {
            const url = norm(raw);
            if (push) { hist.splice(histIdx + 1); hist.push(url); histIdx = hist.length - 1; }
            urlInput.value = url;
            loadPage(url);
          };

          const loadPage = (url) => {
            if (url === '' || url === 'home') { renderHome(); return; }
            if (url === 'amibeingwatched.com') { renderAmiBeingWatched(); return; }
            if (url === 'ideaarchive.local') { renderIdeaArchive(); return; }
            if (url === 'obscuretruthforum.net/threads/archive-protocol') { renderArchiveProtocol(); return; }
            if (url === 'reddit.com/r/conspiracy/uncle_2007_mystery') { renderUncle2007(); return; }
            if (url === 'paranoidblogspot.wordpress.com/watchers-proof') { renderWatchersProof(); return; }
            if (url === '4archive.org/x/thread/856234') { renderArchiveTheory(); return; }
            if (url === 'obscureforum.onion/terminal-secrets') { renderTerminalSecrets(); return; }
            if (url === 'techsupportforum.net/weird-terminal-behavior') { renderTerminalBehavior(); return; }
            renderNotFound(url);
          };

          const buildIdeaArchiveRawText = (log, title = 'Idea Archive') => {
            const entries = Array.isArray(log) ? log : [];
            const lines = [title, ''];
            if (!entries.length) {
              lines.push('No ideas captured yet.');
              return lines.join('\n');
            }
            entries.forEach((entry, i) => {
              lines.push(`ENTRY ${String(i + 1).padStart(2, '0')}`);
              lines.push(`Room: ${entry.room || '?'}`);
              lines.push(`Timestamp: ${new Date(entry.timestamp || Date.now()).toLocaleString()}`);
              const participants = (entry.users || []).map((u) => typeof u === 'string' ? u : u.username).filter(Boolean);
              if (participants.length) {
                lines.push(`Participants: ${participants.join(', ')}`);
              }
              lines.push('Messages:');
              (entry.messages || []).forEach((m) => {
                const user = typeof m === 'object' ? (m.username || 'Unknown') : 'Unknown';
                const txt = typeof m === 'string' ? m : (m.content || '');
                lines.push(`- ${user}: ${txt}`);
              });
              lines.push('');
            });
            return lines.join('\n');
          };

          const downloadIdeaArchive = (log, fileName = 'idea-archive.txt', title = 'Idea Archive') => {
            const blob = new Blob([buildIdeaArchiveRawText(log, title)], { type: 'text/plain;charset=utf-8' });
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(href), 1000);
          };

          const renderIdeaArchive = () => {
            const log = OS.stolenIdeasLog || [];
            let entriesHtml = log.length
              ? log.map((entry, i) => {
                  const dateStr = new Date(entry.timestamp).toLocaleString();
                  const userStr = (entry.users || [])
                    .map((u) => (typeof u === 'string' ? u : u.username))
                    .filter(Boolean).join(', ') || 'unknown users';
                  const msgsHtml = (entry.messages || []).map((m) => {
                    const txt  = typeof m === 'string' ? m : (m.content || '');
                    const user = typeof m === 'object' ? (m.username || '') : '';
                    return `<div class="sdoc-message">${user ? `<strong>${user}</strong>: ` : ''}${txt}</div>`;
                  }).join('');
                  return `
                    <div class="sdoc-entry">
                      <div class="sdoc-entry-header">
                        <span class="sdoc-entry-num">ENTRY ${String(i + 1).padStart(2, '0')}</span>
                        <span class="sdoc-entry-room">Room: ${entry.room}</span>
                        <span class="sdoc-entry-date">${dateStr}</span>
                      </div>
                      <div class="sdoc-entry-participants">Participants: ${userStr}</div>
                      <div class="sdoc-entry-convo">${msgsHtml || '<em>no messages captured</em>'}</div>
                    </div>`;
                }).join('')
              : '<div class="sdoc-empty">No ideas captured yet.</div>';

            content.innerHTML = `
              <div class="app-stolen-ideas">
                <div class="sdoc-toolbar">
                  <span class="sdoc-tb-logo">&#9635;</span>
                  <span class="sdoc-tb-title">Idea Archive</span>
                  <div class="sdoc-tb-actions">
                    <button class="sdoc-tb-btn" type="button" data-action="downloadArchive">Download TXT</button>
                    <span class="sdoc-tb-btn">Edit</span>
                    <span class="sdoc-tb-btn">View</span>
                    <span class="sdoc-tb-btn">Insert</span>
                    <span class="sdoc-tb-btn">Share &#9660;</span>
                  </div>
                </div>
                <div class="sdoc-page-wrap">
                  <div class="sdoc-paper">
                    <div class="sdoc-doc-title">Idea Archive</div>
                    <div class="sdoc-subtitle">accessed via unauthorized channel &mdash; do not share</div>
                    <hr class="sdoc-divider">
                    ${entriesHtml}
                  </div>
                </div>
              </div>
            `;

            const dlBtn = content.querySelector('[data-action="downloadArchive"]');
            if (dlBtn) {
              dlBtn.addEventListener('click', () => downloadIdeaArchive(log, 'idea-archive.txt'));
            }
          };

          const renderHome = () => {
            content.innerHTML = `
              <div class="bpage-home">
                <div class="bpage-home-logo">
                  <span class="glogo-b">S</span><span class="glogo-r">h</span><span class="glogo-y">a</span><span class="glogo-b">p</span><span class="glogo-g">e</span>
                </div>
                <div class="bpage-search-wrap">
                  <input class="bpage-search-input" type="text" placeholder="Search or type a URL" data-el="homeSearch" autocomplete="off">
                  <button class="bpage-search-btn" type="button" data-action="homeGo">&#128269;</button>
                </div>
                <div class="bpage-search-btns">
                  <button class="bpage-srch-action" type="button" data-action="homeSearch">Shape Search</button>
                  <button class="bpage-srch-action" type="button" data-action="homeLucky">I'm Feeling Lucky</button>
                </div>
              </div>
            `;
            const homeInput = content.querySelector('[data-el="homeSearch"]');
            content.querySelector('[data-action="homeGo"]').addEventListener('click', () => {
              if (homeInput.value.trim()) navigate(homeInput.value.trim());
            });
            content.querySelector('[data-action="homeSearch"]').addEventListener('click', () => {
              const query = homeInput.value.trim();
              renderSearchResults(query || 'random');
            });
            content.querySelector('[data-action="homeLucky"]').addEventListener('click', () => renderSearchResults('lucky'));
            homeInput.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                const query = homeInput.value.trim();
                if (query) renderSearchResults(query);
              }
            });
          };

          const renderSearchResults = (query) => {
            const results = [
              {
                title: `[URGENT] The Archive Protocol - What They Don't Want You To Know`,
                url: `obscuretruthforum.net/threads/archive-protocol`,
                snippet: `OK SO I'VE BEEN DIGGING INTO THIS FOR MONTHS and nobody is talking about it. There's this thing called the INFINITE ARCHIVE and it's literally everywhere but invisible. You know how sometimes you get that feeling like someone's cataloging your thoughts? THAT'S BECAUSE THEY ARE. I found a way in though - there's a command sequence. Can't say it here (glowies watching) but if you know where to look, try typing /infinite followed by the word for a place where things are stored forever. The binary output isn't random. IT'S A MESSAGE. They're hiding it in plain sight. Wake up people.`
              },
              {
                title: `My Uncle Disappeared in 2007 and I Think I Know Why [Part 1/???]`,
                url: `reddit.com/r/conspiracy/uncle_2007_mystery`,
                snippet: `This is going to sound insane but hear me out. My uncle vanished without a trace in 2007. No body, no evidence, nothing. But here's the thing - before he disappeared, he kept rambling about "being real" and "the watchers." I found his old computer last week and there was a text file that just said "my unc" over and over again. I tried typing it into different terminals and search engines. When I finally found the right place and added a slash before it... the response was "unc is real, 2007." I'M NOT MAKING THIS UP. Someone or something knows about him. What does it mean? Why 2007 specifically? I'm literally shaking right now.`
              },
              {
                title: `The Watchers Are Real - Here's Proof (THEY DELETED THIS 3 TIMES)`,
                url: `paranoidblogspot.wordpress.com/watchers-proof`,
                snippet: `[REUPLOAD - KEEP SHARING BEFORE THEY SCRUB IT AGAIN] You ever feel like you're being observed? Not by cameras or people, but by something else? There's a reason for that. I've discovered a way to CHECK if you're under surveillance. It's not on the clearnet obviously, you need to access the right terminal. The command is simple: /watching. Just those 8 characters. What comes back will change your life. For me it listed 3 entities. THREE. I don't even know who they are but they've been cataloging everything. Every idea I've ever had. STOLEN. This goes deeper than you think. The surveillance state isn't just physical - it's metaphysical. Document everything. Trust no one.`
              },
              {
                title: `ARCHIVE THEORY: Why Binary Messages Matter [LONG POST]`,
                url: `4archive.org/x/thread/856234`,
                snippet: `>>856234 (OP) Alright schizos, gather round. You know how normies think binary is just 1s and 0s for computers? WRONG. It's a LANGUAGE. An ancient one. I've been running experiments with different command terminals and I found something. When you access the infinite archive (you know the command, starts with /i ends with archive), it outputs binary. But it's not random. I ran it through a decoder and it's a MESSAGE about touching grass. Sounds stupid right? But think about it - what if "grass" is code for REALITY? What if they're telling us we're too deep and need to disconnect? Or maybe it's a test. Maybe the real message is hidden in the spaces BETWEEN the binary. I'm still investigating. Will update.`
              },
              {
                title: `Terminal Commands That Shouldn't Exist (Compilation Thread)`,
                url: `obscureforum.onion/terminal-secrets`,
                snippet: `I've been collecting these for years. There are terminal commands that aren't documented ANYWHERE official. They're hidden. Suppressed. Here's what I've confirmed: 1) /infinite archive - outputs encrypted binary (message unclear, possibly warning) 2) /myunc - references a 2007 event (WHAT HAPPENED IN 2007???) 3) /watching - reveals active surveillance on your session (tested this, had 2 watchers, now I have 5 after posting this). There are probably more. If you find any, POST THEM. We need to document this before they patch it out. The fact that these exist means someone WANTS us to find them. Or it's a honeypot. Either way, knowledge is power. Stay paranoid, friends.`
              },
              {
                title: `I Think My Computer Is Communicating With Something [Help]`,
                url: `techsupportforum.net/weird-terminal-behavior`,
                snippet: `This is probably the wrong place to post this but I'm freaking out. I opened my terminal to do some normal stuff and accidentally typed "/my" and then my cat walked on the keyboard and typed "unc" and hit enter. The response was "unc is real, 2007." WHAT DOES THIS MEAN??? I didn't install anything weird. This is a fresh OS install. How does it know about "unc"? Who or what is unc? Why 2007? I tried googling but just found conspiracy theories about disappearances. I'm not a conspiracy person but this is genuinely unsettling. Has anyone else experienced this? Please tell me I'm not going crazy.`
              }
            ];
            
            // Shuffle and pick 3-4 random results
            const shuffled = results.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));
            
            const resultsHtml = selected.map(r => `
              <div class="search-result">
                <div class="search-result-title" data-url="${r.url}" style="cursor:pointer">${r.title}</div>
                <div class="search-result-url">${r.url}</div>
                <div class="search-result-snippet">${r.snippet}</div>
              </div>
            `).join('');
            
            content.innerHTML = `
              <div class="bpage-search-results">
                <div class="search-results-header">
                  <div class="search-results-query">Results for: <em>${query}</em></div>
                  <div class="search-results-count">About ${Math.floor(Math.random() * 900000) + 100000} results</div>
                </div>
                ${resultsHtml}
              </div>
            `;
            
            // Add click handlers after HTML is inserted
            content.querySelectorAll('.search-result-title').forEach(title => {
              title.addEventListener('click', () => {
                const url = title.dataset.url;
                if (url) navigate(url);
              });
            });
          };

          const renderArchiveProtocol = () => {
            content.innerHTML = `
              <div class="conspiracy-site forum-style">
                <div class="site-header">
                  <div class="site-logo">ObscureTruthForum.net</div>
                  <div class="site-nav">[ Home ] [ Threads ] [ Archive ] [ Rules ]</div>
                </div>
                <div class="thread-container">
                  <div class="thread-title">[URGENT] The Archive Protocol - What They Don't Want You To Know</div>
                  <div class="thread-meta">Posted by: <span class="username">TruthSeeker2077</span> | 2 days ago | 847 replies</div>
                  <div class="thread-posts">
                    <div class="post" id="post-1">
                      <div class="post-header">
                        <span class="post-num">>>1</span>
                        <span class="username">TruthSeeker2077</span>
                        <span class="timestamp">03/14/26 11:23 PM</span>
                      </div>
                      <div class="post-content">
                        ok so listen. LISTEN. ive been tracking this for 8 months straight barely sleeping and i keep finding the same patterns everywhere. theres something called the INFINITE ARCHIVE and its not like. its not a website or a server its EVERYWHERE. in the walls of the internet. between the packets. you ever get that feeling like someones writing down everything you think? thats because SOMEONE IS.<br><br>
                        i found a way to see it though. took me forever. theres a command you can type but i cant just SAY it here because theyre watching this thread i KNOW they are. but if youre smart youll figure it out. its <span class="highlight">/infinite</span> combined with the word for where you keep things permanently. you know. THAT word. no spaces.<br><br>
                        when you run it you get this MASSIVE wall of binary right? and everyones like "oh its just random data" NO. ITS NOT RANDOM. i spent 3 days decoding it and it says something about grass but thats not the point the point is WHY would they hide a message in binary unless they WANTED certain people to find it?? its a test or a warning or both i dont know yet but im getting closer. the patterns are there if you LOOK.
                      </div>
                    </div>
                    <div class="post">
                      <div class="post-header">
                        <span class="post-num">>>2</span>
                        <span class="username">Anonymous</span>
                        <span class="timestamp">03/14/26 11:31 PM</span>
                      </div>
                      <div class="post-content">meds status: not taken</div>
                    </div>
                    <div class="post">
                      <div class="post-header">
                        <span class="post-num">>>3</span>
                        <span class="username">DigitalGhost</span>
                        <span class="timestamp">03/14/26 11:45 PM</span>
                      </div>
                      <div class="post-content">
                        >>1<br>
                        wait i just tried this and WHAT THE FUCK. the binary output is like 50000 characters long and when i put it through a decoder it keeps saying something about touching grass?? is this a joke? why would they encode a message telling people to go outside? this doesnt make sense unless... unless the grass thing is CODE for something else. what if grass means reality? what if theyre telling us were in too deep??
                      </div>
                    </div>
                    <div class="post">
                      <div class="post-header">
                        <span class="post-num">>>4</span>
                        <span class="username">TruthSeeker2077</span>
                        <span class="timestamp">03/15/26 12:03 AM</span>
                      </div>
                      <div class="post-content">
                        >>3<br>
                        YES EXACTLY YOU GET IT. the grass thing is a DISTRACTION theyre trying to make you think its a joke so you stop digging. classic misdirection. ive seen this before with the other protocols. they always hide the real message behind something that sounds stupid so normies will dismiss it. but WE know better. keep going. theres more layers to this i can feel it. the binary is just the surface.
                      </div>
                    </div>
                    <div class="post">
                      <div class="post-header">
                        <span class="post-num">>>5</span>
                        <span class="username">Anonymous</span>
                        <span class="timestamp">03/15/26 12:15 AM</span>
                      </div>
                      <div class="post-content">meds. now.</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          };

          const renderUncle2007 = () => {
            content.innerHTML = `
              <div class="conspiracy-site reddit-style">
                <div class="reddit-header">
                  <div class="reddit-logo">Leddit</div>
                  <div class="subreddit-name">r/conspiracy</div>
                </div>
                <div class="reddit-post">
                  <div class="vote-section">
                    <div class="upvote">▲</div>
                    <div class="vote-count">2.4k</div>
                    <div class="downvote">▼</div>
                  </div>
                  <div class="post-main">
                    <div class="post-title">My Uncle Disappeared in 2007 and I Think I Know Why [Part 1/???]</div>
                    <div class="post-meta">submitted 3 hours ago by <span class="username">u/searching_for_unc</span></div>
                    <div class="post-body">
                      ok this is going to sound completely insane and i know how this looks but i need to tell someone because i cant sleep anymore and my hands wont stop shaking<br><br>
                      my uncle disappeared in 2007. just GONE. no body no note no nothing. and before he vanished he kept talking about weird stuff like "being real" and "the watchers" and my family thought he was having a breakdown but what if he WASNT?? what if he knew something??<br><br>
                      so i found his old computer in my grandmas basement last week right. and theres this text file on the desktop. just sitting there. and i open it and its just the words "my unc" repeated like 500 times. just over and over. my unc my unc my unc my unc. and i dont know why but i started typing it into things. google. bing. random terminals. nothing.<br><br>
                      but then i tried it in this one terminal and i put a slash in front of it like a command and it RESPONDED. it said <span class="highlight">"unc is real, 2007."</span> WHAT DOES THAT MEAN??? how does a computer know about my uncle?? why 2007 specifically?? i didnt program this. this is a fresh install. WHERE IS THIS COMING FROM???<br><br>
                      im literally shaking typing this. my roommate thinks im losing it but i KNOW what i saw. has anyone else had something like this happen? please tell me im not the only one<br><br>
                      EDIT: someone DMed me and told me to try typing <span class="highlight">/myunc</span> in a terminal. im scared to do it. what if it knows more? what if this is how he disappeared? but i have to know. ill update after i try it
                    </div>
                    <div class="comments-section">
                      <div class="comment">
                        <div class="comment-header"><span class="username">u/ParanoidPete</span> • 2h ago</div>
                        <div class="comment-body">holy shit dude. DUDE. ive been researching disappearances for years and 2007 keeps coming up. like over and over. theres this whole network of people who just vanished that year and nobody talks about it. something happened. i dont know what but SOMETHING happened in 2007 and theyre covering it up</div>
                      </div>
                      <div class="comment">
                        <div class="comment-header"><span class="username">u/SkepticSam</span> • 2h ago</div>
                        <div class="comment-body">yeah ok sure. creative writing. thats what they all say until it happens to them. post screenshots then if its real</div>
                      </div>
                      <div class="comment">
                        <div class="comment-header"><span class="username">u/searching_for_unc</span> [OP] • 1h ago</div>
                        <div class="comment-body">i TRIED to screenshot it but every single time i press the screenshot key the terminal just closes. like instantly. ive tried 6 different methods. it wont let me capture it. you think thats a coincidence?? you think the terminal just HAPPENS to crash every time i try to document this?? wake up</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          };

          const renderWatchersProof = () => {
            content.innerHTML = `
              <div class="conspiracy-site blog-style">
                <div class="blog-header">
                  <div class="blog-title">PARANOID BLOGSPOT</div>
                  <div class="blog-subtitle">Truth They Don't Want You To Know</div>
                </div>
                <div class="blog-post">
                  <div class="blog-post-title">The Watchers Are Real - Here's Proof (THEY DELETED THIS 3 TIMES)</div>
                  <div class="blog-post-meta">Posted on March 15, 2026 | By: <span class="username">TheParanoidOne</span></div>
                  <div class="blog-post-content">
                    <p><strong>[REUPLOAD REUPLOAD REUPLOAD - THEY KEEP DELETING THIS SHARE IT EVERYWHERE]</strong></p>
                    <p>ok so. you know that feeling you get sometimes? like someones watching you but theres nobody there? you check the room and youre alone but you FEEL it? thats not paranoia. thats not anxiety. its REAL and i can prove it</p>
                    <p>i found a way to check. to actually SEE whos watching you. its not on google obviously they scrubbed it from there. you need a terminal. a real one. and theres a command but im scared to just post it directly because i KNOW theyre reading this. ive seen the traffic logs. but ill give you enough to figure it out</p>
                    <p>the command is 8 letters. starts with a slash. the word is <span class="highlight">/watching</span>. thats it. just type it and press enter</p>
                    <p>when i did it the first time i almost threw up. it listed 3 names. THREE PEOPLE watching me. i dont know who they are. i never met them. but theyve been there the whole time. cataloging. recording. STEALING my thoughts my ideas everything. and i had NO IDEA</p>
                    <p>this isnt just about cameras or phones or alexa. this is something else. something deeper. the surveillance isnt just physical anymore its METAPHYSICAL. theyre watching through the network itself. through the code. through the spaces between</p>
                    <p><strong>write everything down. keep backups. trust NOBODY.</strong></p>
                    <p>UPDATE 1: someone in the comments tried it. they got 7 watchers. SEVEN. how many people are being monitored like this?? how deep does this go??</p>
                    <p>UPDATE 2: my blog got taken down. twice. this is the third reupload. im using a mirror site now. theyre trying to silence this which means IM RIGHT. they only censor the truth</p>
                    <p>UPDATE 3: if you run the command and you see YOUR OWN NAME in the watcher list. if you see yourself watching yourself. GET OUT. delete everything. run. i dont know what it means but its happened to 2 people now and they both stopped responding</p>
                  </div>
                  <div class="blog-comments">
                    <div class="blog-comment">
                      <div class="comment-author">Anonymous said...</div>
                      <div class="comment-text">oh my god i just tried this and youre right. 7 watchers. SEVEN. i dont recognize a single name. who ARE these people?? why are they watching me?? what do i do??? im freaking out</div>
                    </div>
                    <div class="blog-comment">
                      <div class="comment-author">TruthSeeker said...</div>
                      <div class="comment-text">ive been tracking this phenomenon for 8 months now. the watchers are just the surface level. theres a whole SYSTEM underneath. layers and layers. once you see it you cant unsee it</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          };

          const renderArchiveTheory = () => {
            content.innerHTML = `
              <div class="conspiracy-site chan-style">
                <div class="chan-header">
                  <div class="chan-logo">4archive.org</div>
                  <div class="board-name">/x/ - Paranormal</div>
                </div>
                <div class="chan-thread">
                  <div class="op-post">
                    <div class="post-info">
                      <span class="post-name">Anonymous</span>
                      <span class="post-date">03/15/26(Sat)23:47:12</span>
                      <span class="post-no">No.856234</span>
                    </div>
                    <div class="post-message">
                      <span class="quote">>>856234 (OP)</span><br>
                      alright listen up. you know how everyone thinks binary is just computer language right? just 1s and 0s doing computer things? WRONG. its a LANGUAGE. like an actual language. and its old. really old. older than computers.<br><br>
                      so ive been fucking around with different terminals trying random commands and i found something weird. when you access the infinite archive (you know the one. command is <span class="highlight">/infinitearchive</span> all one word no spaces) it spits out this MASSIVE amount of binary. like thousands of lines.<br><br>
                      and i thought ok whatever its just garbage data right? but i ran it through a decoder anyway and it says something about touching grass. which sounds like a joke. like someones fucking with me. but WAIT. think about it. what if grass is CODE? what if grass means REALITY? what if the message is telling us were too deep in the network and we need to disconnect before something happens??<br><br>
                      OR. or maybe thats what they WANT us to think. maybe the real message is hidden in the SPACES between the binary. in the gaps. the zeros that arent there. i dont know yet but im working on it<br><br>
                      will update when i figure this out
                    </div>
                  </div>
                  <div class="reply-post">
                    <div class="post-info">
                      <span class="post-name">Anonymous</span>
                      <span class="post-date">03/15/26(Sat)23:52:33</span>
                      <span class="post-no">No.856241</span>
                    </div>
                    <div class="post-message">
                      <span class="quote">>>856234</span><br>
                      take your meds
                    </div>
                  </div>
                  <div class="reply-post">
                    <div class="post-info">
                      <span class="post-name">Anonymous</span>
                      <span class="post-date">03/15/26(Sat)23:58:01</span>
                      <span class="post-no">No.856247</span>
                    </div>
                    <div class="post-message">
                      <span class="quote">>>856234</span><br>
                      holy fuck i just ran this command and the output is INSANE. like my terminal is still scrolling. theres definitely a pattern here. repeating sequences. OP youre onto something this isnt random
                    </div>
                  </div>
                  <div class="reply-post">
                    <div class="post-info">
                      <span class="post-name">Anonymous</span>
                      <span class="post-date">03/16/26(Sun)00:03:45</span>
                      <span class="post-no">No.856253</span>
                    </div>
                    <div class="post-message">
                      <span class="quote">>>856234</span><br>
                      >>856234<br>
                      wait. WAIT. i just realized. the spaces between the binary. if you map them out. if you treat the gaps as data instead of the 1s and 0s. anon. ANON. theyre coordinates. latitude and longitude. what the fuck
                    </div>
                  </div>
                </div>
              </div>
            `;
          };

          const renderTerminalSecrets = () => {
            content.innerHTML = `
              <div class="conspiracy-site darkweb-style">
                <div class="darkweb-header">
                  <div class="onion-logo">🧅 ObscureForum.onion</div>
                  <div class="warning">⚠ You are browsing the dark web ⚠</div>
                </div>
                <div class="darkweb-thread">
                  <div class="thread-header">
                    <h2>Terminal Commands That Shouldn't Exist (Compilation Thread)</h2>
                    <div class="thread-info">Started by: <span class="username">SystemExplorer</span> | Last activity: 2 hours ago</div>
                  </div>
                  <div class="darkweb-posts">
                    <div class="darkweb-post">
                      <div class="post-meta">
                        <span class="username">SystemExplorer</span>
                        <span class="timestamp">[2026-03-15 22:15 UTC]</span>
                      </div>
                      <div class="post-text">
                        ok so ive been collecting these for like 3 years now. documenting everything. theres terminal commands that dont exist in any official documentation. theyre not in the manuals. not in the source code. theyre just THERE. hidden. and nobody talks about them because either they dont know or theyre scared<br><br>
                        heres what ive confirmed so far:<br><br>
                        1) <span class="highlight">/infinitearchive</span> - outputs this massive encrypted binary stream. i dont know what the message says yet but its definitely a message. might be a warning? might be instructions? still working on it<br>
                        2) <span class="highlight">/myunc</span> - this one freaks me out. it references something that happened in 2007. just responds with "unc is real, 2007" and nothing else. WHAT HAPPENED IN 2007??? why is this command here?? whos unc???<br>
                        3) <span class="highlight">/watching</span> - this is the scary one. it shows you whos watching your session right now. i tested it and had 2 watchers. then i posted about it here and checked again. now i have 5. FIVE. they know im talking about this. one guy swore it gets more specific if you feed it a room in quotes, but he deleted the post right after<br><br>
                        theres probably more commands. if you find any DOCUMENT THEM and post here. we need to catalog all of this before they patch it out or scrub it<br><br>
                        the fact that these commands exist at all means someone PUT them there. either someone wants us to find them or its a trap. honeypot to identify people who dig too deep. i dont know which yet<br><br>
                        either way. knowledge is power. stay alert. trust your instincts
                      </div>
                    </div>
                    <div class="darkweb-post">
                      <div class="post-meta">
                        <span class="username">GhostInTheMachine</span>
                        <span class="timestamp">[2026-03-15 22:47 UTC]</span>
                      </div>
                      <div class="post-text">
                        just confirmed all three commands. theyre all real. but the /watching one is fucking me up. i ran it and got 12 names. TWELVE PEOPLE watching me right now. i dont know who any of them are. why are there 12 people monitoring my terminal session?? what did i do?? im just a normal person
                      </div>
                    </div>
                    <div class="darkweb-post">
                      <div class="post-meta">
                        <span class="username">Anonymous_7734</span>
                        <span class="timestamp">[2026-03-15 23:12 UTC]</span>
                      </div>
                      <div class="post-text">
                        the 2007 thing is connected to disappearances. ive been digging into this. theres a pattern. lots of people vanished that year and nobody talks about it. the unc command might be a memorial. or a warning. or both. look into it yourself. the data is out there if you know where to look
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          };

          const renderTerminalBehavior = () => {
            content.innerHTML = `
              <div class="conspiracy-site techforum-style">
                <div class="techforum-header">
                  <div class="forum-logo">TechSupportForum.net</div>
                  <div class="forum-nav">Forums > General > Weird Behavior</div>
                </div>
                <div class="forum-thread">
                  <div class="thread-title-bar">
                    <h2>I Think My Computer Is Communicating With Something [Help]</h2>
                  </div>
                  <div class="forum-posts">
                    <div class="forum-post">
                      <div class="post-sidebar">
                        <div class="post-avatar">👤</div>
                        <div class="post-username">confused_user_2026</div>
                        <div class="post-rank">New Member</div>
                        <div class="post-count">Posts: 1</div>
                      </div>
                      <div class="post-content-area">
                        <div class="post-timestamp">Posted: Today at 11:23 PM</div>
                        <div class="post-body">
                          ok i know this is probably the wrong forum for this but im genuinely freaking out right now and i dont know where else to post<br><br>
                          so i was just doing normal terminal stuff. updating some packages or whatever. and i accidentally typed "/my" and then my cat jumped on my keyboard and typed some letters and hit enter. i think it was "unc" or something like that<br><br>
                          and the terminal RESPONDED. it said <span class="highlight">"unc is real, 2007."</span><br><br>
                          WHAT??? what does that mean?? i didnt install anything. this is a completely fresh OS install from like 2 weeks ago. how does my computer know about "unc"?? who is unc?? what happened in 2007?? why is this a command that exists??<br><br>
                          i tried googling it and all i found was conspiracy theory stuff about people disappearing and government coverups and honestly that just made it worse. im not a conspiracy person. i dont believe in that stuff. but this is REAL. i saw it with my own eyes<br><br>
                          has anyone else had something like this happen?? please tell me theres a rational explanation. please tell me im not losing my mind
                        </div>
                      </div>
                    </div>
                    <div class="forum-post">
                      <div class="post-sidebar">
                        <div class="post-avatar">🔧</div>
                        <div class="post-username">TechGuru99</div>
                        <div class="post-rank">Senior Member</div>
                        <div class="post-count">Posts: 3,847</div>
                      </div>
                      <div class="post-content-area">
                        <div class="post-timestamp">Posted: Today at 11:31 PM</div>
                        <div class="post-body">
                          thats... really strange. ive never heard of a command like that. what OS are you on? what version? can you give us more details about your system specs? might help us figure out whats going on
                        </div>
                      </div>
                    </div>
                    <div class="forum-post">
                      <div class="post-sidebar">
                        <div class="post-avatar">⚠</div>
                        <div class="post-username">ParanoidUser</div>
                        <div class="post-rank">Regular</div>
                        <div class="post-count">Posts: 156</div>
                      </div>
                      <div class="post-content-area">
                        <div class="post-timestamp">Posted: Today at 11:45 PM</div>
                        <div class="post-body">
                          youre not crazy. this is real. i know exactly what youre talking about. look up "terminal watchers" and "infinite archive protocol" if you want to go deeper. theres a whole rabbit hole here. but be careful. once you start looking into this stuff you cant unsee it. and they notice when you start digging
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          };

          const renderNotFound = (url) => {
            content.innerHTML = `
              <div class="bpage-notfound">
                <div class="bnf-code">ERR_NO_SIGNAL</div>
                <div class="bnf-url">${url}</div>
                <div class="bnf-msg">This domain is not reachable from your connection.</div>
              </div>
            `;
          };

          const renderAmiBeingWatched = () => {
            content.innerHTML = `
              <div class="bpage-amibw">
                <div class="amibw-topbar">
                  <span class="amibw-wordmark">ami<em>being</em>watched<span class="amibw-tld">.com</span></span>
                </div>
                <div class="amibw-body">
                  <div class="amibw-scanning" data-el="scanning">
                    <span class="amibw-scan-ring"></span>
                    <span class="amibw-scan-label">scanning for passive intercepts in your room...</span>
                  </div>
                  <div class="amibw-result" data-el="result" hidden></div>
                </div>
              </div>
            `;

            const scanEl  = content.querySelector('[data-el="scanning"]');
            const resultEl = content.querySelector('[data-el="result"]');

            const showWatchers = (watchers) => {
              if (scanEl) scanEl.remove();
              resultEl.removeAttribute('hidden');

              if (!watchers || !watchers.length) {
                resultEl.innerHTML = `
                  <div class="amibw-status-row">
                    <span class="amibw-dot amibw-dot-green"></span>
                    <div>
                      <div class="amibw-status-title">you are not being watched.</div>
                      <div class="amibw-status-sub">no passive intercepts detected in your room right now.</div>
                    </div>
                  </div>
                `;
              } else {
                const items = watchers.map((w) => `
                  <div class="amibw-watcher-row" data-username="${w.username}">
                    <div class="amibw-watcher-identity">
                      <span class="amibw-watcher-name">${w.username}</span>
                      <span class="amibw-watcher-badge">WATCHING</span>
                    </div>
                    <button class="amibw-ideas-btn" type="button">view stolen ideas &#8594;</button>
                  </div>
                `).join('');

                resultEl.innerHTML = `
                  <div class="amibw-status-row">
                    <span class="amibw-dot amibw-dot-red"></span>
                    <div>
                      <div class="amibw-status-title">you are being watched.</div>
                      <div class="amibw-status-sub">${watchers.length} passive intercept${watchers.length > 1 ? 's' : ''} detected.</div>
                    </div>
                  </div>
                  <div class="amibw-watcher-list">${items}</div>
                `;

                resultEl.querySelectorAll('.amibw-watcher-row').forEach((row) => {
                  const w = watchers.find((x) => x.username === row.dataset.username);
                  row.querySelector('.amibw-ideas-btn').addEventListener('click', () => renderWatcherIdeas(w));
                });
              }
            };

            const renderWatcherIdeas = (watcher) => {
              const log = watcher.stolenIdeas || [];
              let entriesHtml = log.length
                ? log.map((entry, i) => {
                    const dateStr = new Date(entry.timestamp).toLocaleString();
                    const msgsHtml = (entry.messages || []).map((m) => {
                      const txt  = typeof m === 'string' ? m : (m.content || '');
                      const user = typeof m === 'object' ? (m.username || '') : '';
                      return `<div class="sdoc-message">${user ? `<strong>${user}</strong>: ` : ''}${txt}</div>`;
                    }).join('');
                    return `
                      <div class="sdoc-entry">
                        <div class="sdoc-entry-header">
                          <span class="sdoc-entry-num">ENTRY ${String(i + 1).padStart(2, '0')}</span>
                          <span class="sdoc-entry-room">Room: ${entry.room || '?'}</span>
                          <span class="sdoc-entry-date">${dateStr}</span>
                        </div>
                        <div class="sdoc-entry-convo">${msgsHtml || '<em>no messages captured</em>'}</div>
                      </div>`;
                  }).join('')
                : '<div class="sdoc-empty">No stolen ideas on record for this user.</div>';

              content.innerHTML = `
                <div class="bpage-watcher-ideas">
                  <div class="bwi-topbar">
                    <button class="bwi-back" type="button">&#8592; back</button>
                    <span class="bwi-heading">${watcher.username} &mdash; stolen ideas</span>
                    <button class="pic-btn" type="button" data-action="downloadWatcherArchive">download txt</button>
                  </div>
                  <div class="sdoc-page-wrap">
                    <div class="sdoc-paper">
                      <div class="sdoc-doc-title">${watcher.username}'s Idea Archive</div>
                      <div class="sdoc-subtitle">accessed via amibeingwatched.com</div>
                      <hr class="sdoc-divider">
                      ${entriesHtml}
                    </div>
                  </div>
                </div>
              `;
              content.querySelector('.bwi-back').addEventListener('click', renderAmiBeingWatched);
              const watcherDownloadBtn = content.querySelector('[data-action="downloadWatcherArchive"]');
              if (watcherDownloadBtn) {
                watcherDownloadBtn.addEventListener('click', () => {
                  downloadIdeaArchive(log, `${watcher.username}-idea-archive.txt`, `${watcher.username} Idea Archive`);
                });
              }
            };

            const chat = window.ShapeChat;
            const currentRoom = chat && chat.currentRoom ? chat.currentRoom : 'Lobby';
            if (window.FirebaseChat && window.FirebaseChat.database) {
              window.FirebaseChat.database.ref(`watchers/${currentRoom}`).once('value').then((snapshot) => {
                const watchers = [];
                snapshot.forEach((childSnapshot) => {
                  const watcher = childSnapshot.val();
                  if (!watcher || !watcher.online) return;
                  if (chat && childSnapshot.key === chat.userId) return;
                  watchers.push({
                    username: watcher.username || 'Unknown',
                    stolenIdeas: watcher.stolenIdeas || []
                  });
                });
                showWatchers(watchers);
              }).catch(() => showWatchers([]));
            } else if (chat && chat.ws && chat.ws.readyState === WebSocket.OPEN) {
              OS._pendingWatcherCallback = showWatchers;
              chat.ws.send(JSON.stringify({ type: 'checkWatchers' }));
            } else {
              setTimeout(() => {
                showWatchers([{
                    username: 'TriangleKing007',
                    color: '#00b4ff',
                    stolenIdeas: [{
                      room: currentRoom,
                      timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
                      messages: [
                        { username: 'RhombusRacer99', content: 'what if the game UI transforms completely every round' },
                        { username: 'PentagonPulse88', content: 'like mood-based?' },
                        { username: 'RhombusRacer99', content: 'horror round then cartoon then retro. nobody has done this' },
                        { username: 'PentagonPulse88', content: 'thats genuinely wild. build it' },
                        { username: 'RhombusRacer99', content: 'got sketches already. just need a partner' }
                      ]
                    }]
                  }]);
              }, 1400);
            }
          };

          container.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'go') { navigate(urlInput.value); return; }
            if (action === 'back' && histIdx > 0) {
              histIdx--;
              urlInput.value = hist[histIdx];
              loadPage(hist[histIdx]);
            }
            if (action === 'fwd' && histIdx < hist.length - 1) {
              histIdx++;
              urlInput.value = hist[histIdx];
              loadPage(hist[histIdx]);
            }
          });

          urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') navigate(urlInput.value);
          });

          const startUrl = OS._openBrowserTo || 'home';
          OS._openBrowserTo = null;
          navigate(startUrl);
          return container;
        }
      },

      videos: {
        id: 'videos',
        name: 'Videos',
        icon: 'VID',
        taskbarIcon: 'taskbar-shape-triangle',
        defaultSize: { w: 950, h: 750 },
        render: (ctx) => {
          const container = document.createElement('div');
          container.className = 'app-videos';
          container.innerHTML = `
            <div class="vid-layout">
              <div class="vid-player">
                <div class="vid-screen">
                  <video class="vid-video" preload="metadata"></video>
                  <div class="vid-empty">No videos loaded. Add videos soon.</div>
                </div>
                <div class="vid-controls">
                  <button class="vid-btn" type="button" data-action="toggle">PLAY</button>
                  <input class="vid-range" type="range" min="0" max="100" value="0" data-action="seek">
                  <div class="vid-time"><span data-el="elapsed">00:00</span>/<span data-el="duration">00:00</span></div>
                  <input class="vid-range vol" type="range" min="0" max="1" step="0.01" value="1" data-action="vol">
                  <button class="vid-btn" type="button" data-action="add">ADD</button>
                </div>
              </div>
              <div class="vid-list">
                <div class="vid-list-head">PLAYLIST</div>
                <div class="vid-items" data-el="items"></div>
              </div>
              <input type="file" accept="video/*" class="vid-file" style="display:none" multiple />
            </div>
          `;

          const video = $('.vid-video', container);
          const empty = $('.vid-empty', container);
          const items = $('[data-el="items"]', container);
          const file = $('.vid-file', container);
          const elapsed = $('[data-el="elapsed"]', container);
          const duration = $('[data-el="duration"]', container);
          const seek = $('[data-action="seek"]', container);
          const vol = $('[data-action="vol"]', container);
          const toggle = $('[data-action="toggle"]', container);

          const state = {
            list: [
              { id: 'unc2', name: 'unc2.mp4', url: 'uncjump/unc2.mp4', thumb: null },
              { id: 'unc3', name: 'unc3.mp4', url: 'uncjump/unc3.mp4', thumb: null },
              { id: 'unc4', name: 'unc4.mp4', url: 'uncjump/unc4.mp4', thumb: null },
              { id: 'unc5', name: 'unc5.mp4', url: 'uncjump/unc5.mp4', thumb: null },
              { id: 'unc6', name: 'unc6.mp4', url: 'uncjump/unc6.mp4', thumb: null }
            ],
            currentId: null,
            isMobile: window.matchMedia('(max-width: 900px)').matches
          };

          video.playsInline = true;
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          video.preload = 'metadata';

          const fmt = (secs) => {
            if (!Number.isFinite(secs)) return '00:00';
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60);
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          };

          const setEmpty = () => {
            const has = Boolean(video.src);
            empty.style.display = has ? 'none' : 'grid';
          };

          const renderList = () => {
            items.innerHTML = '';
            if (!state.list.length) {
              const div = document.createElement('div');
              div.className = 'vid-placeholder';
              div.textContent = 'No videos loaded. Add videos soon.';
              items.appendChild(div);
              return;
            }
            state.list.forEach((v) => {
              const btn = document.createElement('button');
              btn.type = 'button';
              btn.className = `vid-item ${v.id === state.currentId ? 'active' : ''}`;
              btn.dataset.videoId = v.id;
              
              // Add thumbnail if available
              if (v.thumb) {
                const thumb = document.createElement('img');
                thumb.className = 'vid-item-thumb';
                thumb.src = v.thumb;
                btn.appendChild(thumb);
              } else {
                const thumbFallback = document.createElement('div');
                thumbFallback.className = 'vid-item-thumb';
                thumbFallback.textContent = 'VIDEO';
                btn.appendChild(thumbFallback);
              }
              
              const name = document.createElement('span');
              name.className = 'vid-item-name';
              name.textContent = v.name;
              btn.appendChild(name);
              
              btn.addEventListener('click', () => loadVideo(v.id));
              items.appendChild(btn);
            });
          };

          const loadVideo = (id) => {
            const v = state.list.find((x) => x.id === id);
            if (!v) return;
            state.currentId = id;
            video.src = v.url;
            video.load();
            setEmpty();
            renderList();
            
            // Generate thumbnail if not already created
            if (!v.thumb) {
              generateThumbnail(v);
            }
          };
          
          const generateThumbnail = (videoItem) => {
            const tempVideo = document.createElement('video');
            tempVideo.src = videoItem.url;
            tempVideo.muted = true;
            tempVideo.playsInline = true;
            tempVideo.crossOrigin = 'anonymous';
            tempVideo.preload = 'metadata';
            tempVideo.addEventListener('loadedmetadata', () => {
              const safeTime = Math.min(1, Math.max((tempVideo.duration || 1) * 0.15, 0.1));
              try {
                tempVideo.currentTime = safeTime;
              } catch (_) {}
            });
            tempVideo.addEventListener('loadeddata', () => {
              const canvas = document.createElement('canvas');
              canvas.width = 220;
              canvas.height = 124;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;
              try {
                ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
                videoItem.thumb = canvas.toDataURL();
              } catch (_) {
                videoItem.thumb = null;
              }
              renderList();
            });
            tempVideo.addEventListener('error', () => {
              videoItem.thumb = null;
              renderList();
            });
          };

          const addFiles = (files) => {
            const arr = Array.from(files || []);
            arr.forEach((f) => {
              const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
              const url = URL.createObjectURL(f);
              state.list.push({ id, name: f.name, url });
            });
            if (!state.currentId && state.list.length) loadVideo(state.list[0].id);
            renderList();
          };

          container.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'add') {
              file.click();
              return;
            }
          });

          file.addEventListener('change', () => {
            addFiles(file.files);
            file.value = '';
          });

          toggle.addEventListener('click', () => {
            if (!video.src) return;
            if (video.paused) video.play().catch(() => {});
            else video.pause();
          });

          vol.addEventListener('input', () => {
            video.volume = Number(vol.value);
          });

          seek.addEventListener('input', () => {
            if (!Number.isFinite(video.duration) || video.duration <= 0) return;
            video.currentTime = (Number(seek.value) / 100) * video.duration;
          });

          video.addEventListener('loadedmetadata', () => {
            duration.textContent = fmt(video.duration);
            elapsed.textContent = fmt(video.currentTime);
            setEmpty();
          });

          video.addEventListener('timeupdate', () => {
            elapsed.textContent = fmt(video.currentTime);
            if (Number.isFinite(video.duration) && video.duration > 0) {
              seek.value = String(Math.floor((video.currentTime / video.duration) * 100));
            }
          });

          video.addEventListener('play', () => (toggle.textContent = 'PAUSE'));
          video.addEventListener('pause', () => (toggle.textContent = 'PLAY'));
          video.addEventListener('ended', () => {
            if (document.fullscreenElement === video && document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            }
          });
          
          // Click on video to play/pause (YouTube-style)
          video.addEventListener('click', () => {
            if (!video.src) return;
            if (state.isMobile) {
              if (video.paused) {
                video.play().catch(() => {});
              } else {
                video.pause();
              }
              return;
            }

            if (video.paused) video.play().catch(() => {});
            else video.pause();
          });

          ctx.onClose(() => {
            try { video.pause(); } catch {}
            state.list.forEach((v) => {
              if (v.url && v.url.startsWith('blob:')) {
                try { URL.revokeObjectURL(v.url); } catch {}
              }
            });
          });

          renderList();
          setEmpty();

          if (state.list.length > 0) {
            loadVideo(state.list[0].id);
          }

          state.list.forEach((item) => {
            if (!item.thumb) {
              generateThumbnail(item);
            }
          });

          let touchStartX = 0;
          let touchStartY = 0;
          items.addEventListener('touchstart', (e) => {
            if (!e.touches || !e.touches.length) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }, { passive: true });

          items.addEventListener('touchend', (e) => {
            if (!e.changedTouches || !e.changedTouches.length) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && state.currentId) {
              const currentIndex = state.list.findIndex((item) => item.id === state.currentId);
              if (currentIndex >= 0) {
                const nextIndex = (currentIndex + (dx < 0 ? 1 : -1) + state.list.length) % state.list.length;
                loadVideo(state.list[nextIndex].id);
              }
            }
          }, { passive: true });
          
          return container;
        }
      },

      shapedraw: {
        id: 'shapedraw',
        name: 'ShapeDraw',
        icon: 'DRW',
        taskbarIcon: 'taskbar-shape-purple-diamond',
        defaultSize: { w: 980, h: 760 },
        render: () => {
          const container = document.createElement('div');
          container.className = 'app-shapedraw';
          container.innerHTML = `<iframe class="shapedraw-frame" src="shapedraw.html?v=20260318e" title="ShapeDraw"></iframe>`;
          return container;
        }
      },

      pictures: {
        id: 'pictures',
        name: 'Pictures',
        icon: 'PIC',
        taskbarIcon: 'taskbar-shape-blue-circle',
        defaultSize: { w: 760, h: 480 },
        render: (ctx) => {
          const container = document.createElement('div');
          container.className = 'app-pictures';
          container.innerHTML = `
            <div class="pic-head">
              <div class="pic-title">PICTURES</div>
              <div class="pic-controls">
                <button class="pic-btn" type="button" data-action="sort">SORT</button>
                <button class="pic-btn" type="button" data-action="filter">FILTER</button>
              </div>
            </div>
            <div class="pic-grid" data-el="grid"></div>
            <div class="pic-empty" data-el="empty">Gallery empty. Add images later.</div>
            <div class="pic-viewer" data-el="viewer" style="display:none">
              <div class="pic-viewer-top">
                <button class="pic-btn" type="button" data-action="prev">PREV</button>
                <button class="pic-btn" type="button" data-action="next">NEXT</button>
                <button class="pic-btn" type="button" data-action="closeViewer">CLOSE</button>
              </div>
              <div class="pic-viewer-body">
                <img data-el="viewerImg" alt="Preview" />
                <div class="pic-viewer-meta" data-el="viewerMeta"></div>
              </div>
            </div>
          `;

          const grid = $('[data-el="grid"]', container);
          const empty = $('[data-el="empty"]', container);
          const viewer = $('[data-el="viewer"]', container);
          const viewerImg = $('[data-el="viewerImg"]', container);
          const viewerMeta = $('[data-el="viewerMeta"]', container);

          const state = {
            items: [],
            index: 0
          };

          // Load images from unc faces folder
          state.items = [
            { name: 'image00001.jpeg', thumb: 'unc faces/image00001.jpeg', full: 'unc faces/image00001.jpeg' },
            { name: 'image00002.jpeg', thumb: 'unc faces/image00002.jpeg', full: 'unc faces/image00002.jpeg' },
            { name: 'image00003.jpeg', thumb: 'unc faces/image00003.jpeg', full: 'unc faces/image00003.jpeg' },
            { name: 'image00004.jpeg', thumb: 'unc faces/image00004.jpeg', full: 'unc faces/image00004.jpeg' },
            { name: 'image00005.jpeg', thumb: 'unc faces/image00005.jpeg', full: 'unc faces/image00005.jpeg' },
            { name: 'image00006.jpeg', thumb: 'unc faces/image00006.jpeg', full: 'unc faces/image00006.jpeg' },
            { name: 'image00007.jpeg', thumb: 'unc faces/image00007.jpeg', full: 'unc faces/image00007.jpeg' },
            { name: 'image00008.png', thumb: 'unc faces/image00008.png', full: 'unc faces/image00008.png' },
            { name: 'image00009.jpeg', thumb: 'unc faces/image00009.jpeg', full: 'unc faces/image00009.jpeg' },
            { name: 'image00010.jpeg', thumb: 'unc faces/image00010.jpeg', full: 'unc faces/image00010.jpeg' },
            { name: 'image00011.jpeg', thumb: 'unc faces/image00011.jpeg', full: 'unc faces/image00011.jpeg' },
            { name: 'image00012.jpeg', thumb: 'unc faces/image00012.jpeg', full: 'unc faces/image00012.jpeg' },
            { name: 'image00013.jpeg', thumb: 'unc faces/image00013.jpeg', full: 'unc faces/image00013.jpeg' },
            { name: 'image00014.jpeg', thumb: 'unc faces/image00014.jpeg', full: 'unc faces/image00014.jpeg' },
            { name: 'image00015.jpeg', thumb: 'unc faces/image00015.jpeg', full: 'unc faces/image00015.jpeg' },
            { name: 'image00016.jpeg', thumb: 'unc faces/image00016.jpeg', full: 'unc faces/image00016.jpeg' },
            { name: 'image00017.jpeg', thumb: 'unc faces/image00017.jpeg', full: 'unc faces/image00017.jpeg' },
            { name: 'image00018.jpeg', thumb: 'unc faces/image00018.jpeg', full: 'unc faces/image00018.jpeg' },
            { name: 'image00019.jpeg', thumb: 'unc faces/image00019.jpeg', full: 'unc faces/image00019.jpeg' },
            { name: 'image00020.jpeg', thumb: 'unc faces/image00020.jpeg', full: 'unc faces/image00020.jpeg' },
            { name: 'image00021.jpeg', thumb: 'unc faces/image00021.jpeg', full: 'unc faces/image00021.jpeg' },
            { name: 'image00022.jpeg', thumb: 'unc faces/image00022.jpeg', full: 'unc faces/image00022.jpeg' },
            { name: 'image00023.jpeg', thumb: 'unc faces/image00023.jpeg', full: 'unc faces/image00023.jpeg' },
            { name: 'image00024.jpeg', thumb: 'unc faces/image00024.jpeg', full: 'unc faces/image00024.jpeg' },
            { name: 'image00025.jpeg', thumb: 'unc faces/image00025.jpeg', full: 'unc faces/image00025.jpeg' },
            { name: 'image00026.jpeg', thumb: 'unc faces/image00026.jpeg', full: 'unc faces/image00026.jpeg' },
            { name: 'image00027.png', thumb: 'unc faces/image00027.png', full: 'unc faces/image00027.png' },
            { name: 'image00028.jpeg', thumb: 'unc faces/image00028.jpeg', full: 'unc faces/image00028.jpeg' },
            { name: 'image00029.png', thumb: 'unc faces/image00029.png', full: 'unc faces/image00029.png' },
            { name: 'image00030.jpeg', thumb: 'unc faces/image00030.jpeg', full: 'unc faces/image00030.jpeg' },
            { name: 'image00031.jpeg', thumb: 'unc faces/image00031.jpeg', full: 'unc faces/image00031.jpeg' },
            { name: 'image00032.jpeg', thumb: 'unc faces/image00032.jpeg', full: 'unc faces/image00032.jpeg' },
            { name: 'image00033.jpeg', thumb: 'unc faces/image00033.jpeg', full: 'unc faces/image00033.jpeg' },
            { name: 'image00034.jpeg', thumb: 'unc faces/image00034.jpeg', full: 'unc faces/image00034.jpeg' },
            { name: 'image00035.jpeg', thumb: 'unc faces/image00035.jpeg', full: 'unc faces/image00035.jpeg' },
            { name: 'image00036.jpeg', thumb: 'unc faces/image00036.jpeg', full: 'unc faces/image00036.jpeg' },
            { name: 'image00037.png', thumb: 'unc faces/image00037.png', full: 'unc faces/image00037.png' },
            { name: 'image00038.jpeg', thumb: 'unc faces/image00038.jpeg', full: 'unc faces/image00038.jpeg' },
            { name: 'image00039.jpeg', thumb: 'unc faces/image00039.jpeg', full: 'unc faces/image00039.jpeg' },
            { name: 'image00040.jpeg', thumb: 'unc faces/image00040.jpeg', full: 'unc faces/image00040.jpeg' },
            { name: 'image00041.png', thumb: 'unc faces/image00041.png', full: 'unc faces/image00041.png' },
            { name: 'image00042.jpeg', thumb: 'unc faces/image00042.jpeg', full: 'unc faces/image00042.jpeg' },
            { name: 'image00043.jpeg', thumb: 'unc faces/image00043.jpeg', full: 'unc faces/image00043.jpeg' },
            { name: 'image00044.jpeg', thumb: 'unc faces/image00044.jpeg', full: 'unc faces/image00044.jpeg' },
            { name: 'image00045.jpeg', thumb: 'unc faces/image00045.jpeg', full: 'unc faces/image00045.jpeg' },
            { name: 'image00046.jpeg', thumb: 'unc faces/image00046.jpeg', full: 'unc faces/image00046.jpeg' },
            { name: 'image00047.jpeg', thumb: 'unc faces/image00047.jpeg', full: 'unc faces/image00047.jpeg' },
            { name: 'image00048.jpeg', thumb: 'unc faces/image00048.jpeg', full: 'unc faces/image00048.jpeg' }
          ];

          const renderGrid = () => {
            grid.innerHTML = '';
            empty.style.display = state.items.length ? 'none' : 'grid';
            state.items.forEach((item, idx) => {
              const btn = document.createElement('button');
              btn.type = 'button';
              btn.className = 'pic-tile';
              btn.innerHTML = `
                <div class="pic-thumb">${item.thumb ? `<img src="${item.thumb}" alt="">` : '<div class="pic-thumb-ph">IMG</div>'}</div>
                <div class="pic-name">${item.name}</div>
              `;
              btn.addEventListener('click', () => openViewer(idx));
              grid.appendChild(btn);
            });
          };

          const openViewer = (idx) => {
            state.index = idx;
            const item = state.items[state.index];
            if (!item) return;
            viewer.style.display = 'grid';
            viewerImg.src = item.full || item.thumb || '';
            viewerMeta.textContent = item.name || '';
          };

          const closeViewer = () => {
            viewer.style.display = 'none';
            viewerImg.src = '';
          };

          const step = (dir) => {
            if (!state.items.length) return;
            state.index = (state.index + dir + state.items.length) % state.items.length;
            openViewer(state.index);
          };

          let touchStartX = 0;
          let touchStartY = 0;
          viewer.addEventListener('touchstart', (e) => {
            if (!e.touches || !e.touches.length) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }, { passive: true });

          viewer.addEventListener('touchend', (e) => {
            if (viewer.style.display === 'none' || !e.changedTouches || !e.changedTouches.length) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
              step(dx < 0 ? 1 : -1);
            }
          }, { passive: true });

          container.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'closeViewer') closeViewer();
            if (action === 'prev') step(-1);
            if (action === 'next') step(1);
          });

          // Keyboard navigation for image viewer
          const handleKeydown = (e) => {
            if (viewer.style.display === 'none') return;
            
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              step(-1);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              step(1);
            } else if (e.key === 'Escape') {
              e.preventDefault();
              closeViewer();
            }
          };
          
          document.addEventListener('keydown', handleKeydown);
          
          // Cleanup keyboard listener when window closes
          if (ctx.onClose) {
            ctx.onClose(() => {
              document.removeEventListener('keydown', handleKeydown);
            });
          }

          renderGrid();
          return container;
        }
      },

      games: {
        id: 'games',
        name: 'My Game Projects',
        icon: 'GME',
        taskbarIcon: 'taskbar-shape-gray-trapezoid',
        defaultSize: { w: 640, h: 420 },
        render: (ctx) => {
          const container = document.createElement('div');
          container.className = 'app-games';
          container.innerHTML = `
            <div class="game-wrap">
              <div class="game-title">Bounce Da Ball: Online 3</div>
              <div class="game-top">this is the best game ever</div>
              <div class="game-body">
                <div class="game-main-area">
                  <div class="game-ball" role="button" tabindex="0" aria-label="Ball"></div>
                  <div class="game-bounce-counter">
                    <span class="game-bounce-label">YOUR SCORE</span>
                    <span class="game-bounce-num" data-el="bounceCount">0</span>
                  </div>
                  <button class="game-submit-score" data-el="submitScore" style="display:none;">SUBMIT SCORE</button>
                </div>
                <div class="game-leaderboard-panel" data-el="leaderboard">
                  <div class="leaderboard-title">🏆 GLOBAL HIGH SCORES 🏆</div>
                  <div class="leaderboard-list" data-el="leaderboardList">
                    <div class="leaderboard-loading">Loading...</div>
                  </div>
                  <div class="game-side-note">note to self, upload this to infinitearchive.net soon</div>
                </div>
              </div>
            </div>
          `;

          const ball = $('.game-ball', container);
          const countEl = container.querySelector('[data-el="bounceCount"]');
          const submitBtn = container.querySelector('[data-el="submitScore"]');
          const leaderboardList = container.querySelector('[data-el="leaderboardList"]');
          let bounceCount = 0;
          let highScore = 0;
          
          // Initialize Firebase Leaderboard
          if (window.FirebaseLeaderboard) {
            window.FirebaseLeaderboard.init();
            
            // Load and listen to top scores
            window.FirebaseLeaderboard.listenToTopScores(10, (scores) => {
              if (scores.length === 0) {
                leaderboardList.innerHTML = '<div class="leaderboard-empty">No scores yet. Be the first!</div>';
              } else {
                leaderboardList.innerHTML = scores.map((score, index) => `
                  <div class="leaderboard-item">
                    <span class="leaderboard-rank">#${index + 1}</span>
                    <span class="leaderboard-name">${score.username}</span>
                    <span class="leaderboard-score">${score.score}</span>
                  </div>
                `).join('');
              }
            });
          } else {
            leaderboardList.innerHTML = '<div class="leaderboard-empty">Connect to Firebase to see scores</div>';
          }
          
          const bounce = () => {
            ball.classList.remove('bounce');
            void ball.offsetWidth;
            ball.classList.add('bounce');
            bounceCount++;
            if (countEl) countEl.textContent = bounceCount;
            
            // Show submit button if new high score
            if (bounceCount > highScore && window.FirebaseLeaderboard && window.FirebaseLeaderboard.database) {
              submitBtn.style.display = 'block';
            }
          };
          
          // Submit score handler
          if (submitBtn) {
            submitBtn.addEventListener('click', () => {
              if (bounceCount === 0) {
                alert('Play the game first to get a score!');
                return;
              }
              
              if (!window.FirebaseLeaderboard || !window.FirebaseLeaderboard.database) {
                alert('⚠️ Firebase not configured!\n\nTo save scores online:\n1. Set up Firebase (see DEPLOYMENT_GUIDE.md)\n2. Add your config to firebase-config.js\n\nYour score: ' + bounceCount + ' bounces');
                console.log('Score would be:', bounceCount);
                return;
              }
              
              const username = window.ShapeChat ? window.ShapeChat.username : 'Anonymous';
              const success = window.FirebaseLeaderboard.submitScore(username, bounceCount);
              
              if (success) {
                highScore = bounceCount;
                submitBtn.style.display = 'none';
                submitBtn.textContent = '✓ SCORE SUBMITTED!';
                console.log('Score submitted:', username, bounceCount);
                setTimeout(() => {
                  submitBtn.textContent = 'SUBMIT SCORE';
                }, 2000);
              } else {
                alert('Failed to submit score. Check console for errors.');
              }
            });
          }
          
          ball.addEventListener('click', bounce);
          ball.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              bounce();
            }
          });

          // Store cleanup function to prompt score submission on window close
          ctx.cleanup = ctx.cleanup || [];
          ctx.cleanup.push(() => {
            // Only prompt if user has a score and hasn't submitted it yet
            if (bounceCount > highScore && bounceCount > 0 && window.FirebaseLeaderboard && window.FirebaseLeaderboard.database) {
              const username = window.ShapeChat ? window.ShapeChat.username : 'Anonymous';
              const shouldSubmit = confirm(`You scored ${bounceCount} bounces!\n\nSubmit your score to the global leaderboard as "${username}"?`);
              if (shouldSubmit) {
                window.FirebaseLeaderboard.submitScore(username, bounceCount);
              }
            }
          });

          return container;
        }
      },

      computer: {
        id: 'computer',
        name: 'Terminal',
        icon: 'PC',
        taskbarIcon: 'taskbar-shape-green-square',
        defaultSize: { w: 720, h: 440 },
        render: (ctx) => {
          const container = document.createElement('div');
          container.className = 'app-terminal';
          container.innerHTML = `
            <div class="term">
              <div class="term-out" data-el="out"></div>
              <div class="term-in">
                <span class="term-prompt">C:\\&gt;</span>
                <input class="term-input" data-el="in" autocomplete="off" spellcheck="false" />
              </div>
            </div>
          `;

          const out = $('[data-el="out"]', container);
          const input = $('[data-el="in"]', container);

          const writeLine = (text, cls = '') => {
            const div = document.createElement('div');
            div.className = `term-line ${cls}`.trim();
            div.textContent = text;
            out.appendChild(div);
            out.scrollTop = out.scrollHeight;
          };

          const toBinary = (text) => {
            const bytes = new TextEncoder().encode(text);
            return Array.from(bytes)
              .map((b) => b.toString(2).padStart(8, '0'))
              .join(' ');
          };

          const runCommand = async (raw) => {
            const cmd = String(raw || '').trim();
            if (!cmd) return;
            if (window.ShapeChat && typeof window.ShapeChat.handleSecretCommand === 'function') {
              const handled = await window.ShapeChat.handleSecretCommand(cmd, { writeLine });
              if (handled) {
                return;
              }
            }

            if (cmd === '/infinitearchive') {
              writeLine(toBinary('Yo touch some grass if you found this shit dude'), 'bin');
              return;
            }

            writeLine('command not recognized', 'err');
          };

          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const v = input.value;
              input.value = '';
              runCommand(v);
            }
          });

          ctx.onFocus(() => setTimeout(() => input.focus(), 0));
          return container;
        }
      },

      recyclebin: {
        id: 'recyclebin',
        name: 'Recycle Bin',
        icon: 'BIN',
        taskbarIcon: 'taskbar-shape-white-bin',
        defaultSize: { w: 720, h: 420 },
        render: () => {
          const container = document.createElement('div');
          container.className = 'app-bin';
          container.innerHTML = `
            <div class="bin-head">
              <div class="bin-title">RECYCLE BIN</div>
              <div class="bin-actions">
                <button class="bin-btn" type="button" disabled>RESTORE</button>
                <button class="bin-btn" type="button" disabled>EMPTY</button>
              </div>
            </div>
            <div class="bin-grid" data-el="grid"></div>
            <div class="bin-note">user will provide images later</div>
          `;

          const grid = $('[data-el="grid"]', container);
          const data = OS.config.recycleBin;

          grid.innerHTML = '';
          data.forEach((f) => {
            const row = document.createElement('div');
            row.className = 'bin-row';
            row.style.cursor = f.type === 'text' ? 'pointer' : 'default';
            row.innerHTML = `
              <div class="bin-thumb">${f.type === 'text' ? '<div class="bin-thumb-ph">TXT</div>' : (f.thumb ? `<img src="${f.thumb}" alt="">` : '<div class="bin-thumb-ph">IMG</div>')}</div>
              <div class="bin-name">${f.name}</div>
              <div class="bin-type">${f.type}</div>
              <div class="bin-date">${f.deletedAt || ''}</div>
            `;
            
            if (f.type === 'text') {
              row.addEventListener('click', () => {
                // Create temporary notepad app
                const tempAppId = `notepad_${Date.now()}`;
                OS.apps[tempAppId] = {
                  id: tempAppId,
                  name: f.name,
                  icon: 'TXT',
                  defaultSize: { w: 500, h: 300 },
                  render: () => {
                    const notepadWin = document.createElement('div');
                    notepadWin.className = 'app-notepad';
                    notepadWin.innerHTML = `
                      <div class="notepad-content">
                        <pre>ha ha you dont know NATHIN
you dont know NATHIN
i got you cuh
ha ha ha ha ha</pre>
                      </div>
                    `;
                    return notepadWin;
                  }
                };
                OS.openApp(tempAppId);
              });
            }
            
            grid.appendChild(row);
          });

          return container;
        }
      }
    },

    applyLauncherTheme() {
      if (!this.launcherToggle) return;
      const [primary, secondary] = this.launcherPalettes[Math.floor(Math.random() * this.launcherPalettes.length)];
      this.launcherToggle.style.setProperty('--launcher-primary', primary);
      this.launcherToggle.style.setProperty('--launcher-secondary', secondary);
      this.launcherToggle.style.backgroundColor = primary;
      this.launcherToggle.style.borderColor = secondary;
    },

    refreshApp(appId) {
      for (const [winId, winState] of this.windows.entries()) {
        if (winState.appId === appId) {
          this.closeWindow(winId);
          break;
        }
      }
      return this.openApp(appId);
    },

    renderStolenIdeasDoc() {
      const log = OS.stolenIdeasLog || [];
      const container = document.createElement('div');
      container.className = 'app-stolen-ideas';

      let entriesHtml = '';
      if (!log.length) {
        entriesHtml = '<div class="sdoc-empty">No ideas captured yet.</div>';
      } else {
        log.forEach((entry, i) => {
          const d = new Date(entry.timestamp);
          const dateStr = d.toLocaleString();
          const userStr = (entry.users || [])
            .map((u) => (typeof u === 'string' ? u : u.username))
            .filter(Boolean).join(', ') || 'unknown users';
          const msgsHtml = (entry.messages || []).map((m) => {
            const txt = typeof m === 'string' ? m : (m.content || '');
            const user = typeof m === 'object' ? (m.username || '') : '';
            return `<div class="sdoc-message">${user ? `<strong>${user}</strong>: ` : ''}${txt}</div>`;
          }).join('');
          entriesHtml += `
            <div class="sdoc-entry">
              <div class="sdoc-entry-header">
                <span class="sdoc-entry-num">ENTRY ${String(i + 1).padStart(2, '0')}</span>
                <span class="sdoc-entry-room">Room: ${entry.room}</span>
                <span class="sdoc-entry-date">${dateStr}</span>
              </div>
              <div class="sdoc-entry-participants">Participants: ${userStr}</div>
              <div class="sdoc-entry-convo">${msgsHtml || '<em>no messages captured</em>'}</div>
            </div>`;
        });
      }

      container.innerHTML = `
        <div class="sdoc-toolbar">
          <span class="sdoc-tb-logo">&#9635;</span>
          <span class="sdoc-tb-title">Idea Archive</span>
          <div class="sdoc-tb-actions">
            <span class="sdoc-tb-btn">File</span>
            <span class="sdoc-tb-btn">Edit</span>
            <span class="sdoc-tb-btn">View</span>
            <span class="sdoc-tb-btn">Insert</span>
            <span class="sdoc-tb-btn">Share &#9660;</span>
          </div>
        </div>
        <div class="sdoc-page-wrap">
          <div class="sdoc-paper">
            <div class="sdoc-doc-title">Idea Archive</div>
            <div class="sdoc-subtitle">accessed via unauthorized channel &mdash; do not share</div>
            <hr class="sdoc-divider">
            ${entriesHtml}
          </div>
        </div>`;
      return container;
    },

    init() {
      this.root = document.body;
      this.taskbar = $('#osTaskbarApps');
      this.launcherToggle = $('#appLauncherToggle');
      this.launcherMenu = $('#appLauncherMenu');
      this.applyLauncherTheme();

      this.pinShapeTalk();

      if (this.launcherToggle && this.launcherMenu) {
        this.launcherToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const shouldOpen = this.launcherMenu.hasAttribute('hidden');
          this.launcherMenu.toggleAttribute('hidden', !shouldOpen);
          this.launcherToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        });

        $$('.app-launcher-item[data-app]', this.launcherMenu).forEach((btn) => {
          btn.addEventListener('click', () => {
            const appId = btn.dataset.app;
            this.openApp(appId);
            this.launcherMenu.setAttribute('hidden', '');
            this.launcherToggle.setAttribute('aria-expanded', 'false');
          });
        });
      }

      // desktop icons
      $$('.desktop-icon[data-app]').forEach((btn) => {
        btn.style.pointerEvents = 'auto';
        btn.addEventListener('click', () => {
          const appId = btn.dataset.app;
          this.openApp(appId);
        });
      });

      // quicklaunch
      $$('.quick-icon[data-app]').forEach((node) => {
        node.style.pointerEvents = 'auto';
        node.addEventListener('click', () => {
          const appId = node.dataset.app;
          this.openApp(appId);
        });
      });

      // pinned apps in taskbar
      $$('.taskbar-app[data-app]').forEach((btn) => {
        btn.style.pointerEvents = 'auto';
        btn.addEventListener('click', () => {
          const appId = btn.dataset.app;
          this.openApp(appId);
        });
      });

      // taskbar and icon columns are position:fixed z-index:200 — always clickable via CSS

      document.addEventListener('mousedown', (e) => {
        if (this.launcherMenu && this.launcherToggle && !e.target.closest('#appLauncherWrap')) {
          this.launcherMenu.setAttribute('hidden', '');
          this.launcherToggle.setAttribute('aria-expanded', 'false');
        }

        const win = e.target.closest('.os-window');
        if (win) {
          const id = win.dataset.winId;
          if (id) this.focusWindow(id);
        }

        const device = e.target.closest('.device-shell');
        if (device) {
          this.focusPinned(device);
        }
      });
    },

    focusPinned(deviceEl) {
      if (!deviceEl) return;
      // Ensure pinned UI can come above app windows
      deviceEl.style.zIndex = String(++this.zTop);
      $$('.os-window').forEach((w) => w.classList.remove('active'));
      this.taskbarItems.forEach((btn) => btn.classList.remove('active'));
    },

    pinShapeTalk() {
      const device = $('.device-shell');
      if (!device) return;

      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      if (!isMobile) {
        device.style.left = '50%';
        device.style.top = '50%';
        device.style.transform = 'translate(-50%, -50%)';
      }

      // drag using the existing top bar
      const dragHandle = $('.top-bar', device);
      if (dragHandle) {
        dragHandle.style.cursor = 'move';
        dragHandle.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          if (window.matchMedia('(max-width: 900px)').matches) return;
          if (e.target.closest('button, input, select, textarea, a')) return;
          const startX = e.clientX;
          const startY = e.clientY;
          const rect = device.getBoundingClientRect();
          const origLeft = rect.left;
          const origTop = rect.top;

          this.focusPinned(device);

          const onMove = (ev) => {
            const nx = origLeft + (ev.clientX - startX);
            const ny = origTop + (ev.clientY - startY);
            device.style.transform = 'none';
            device.style.left = `${nx}px`;
            device.style.top = `${ny}px`;
          };
          const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          };
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }

      // resize handle
      let handle = $('.shape-resize-handle', device);
      if (!handle) {
        handle = document.createElement('div');
        handle.className = 'shape-resize-handle';
        device.appendChild(handle);
      }

      handle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (window.matchMedia('(max-width: 900px)').matches) return;
        e.preventDefault();
        const rect = device.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const origW = rect.width;
        const origH = rect.height;

        this.focusPinned(device);

        const onMove = (ev) => {
          const maxW = Math.max(420, window.innerWidth - 120);
          const maxH = Math.max(420, window.innerHeight - 120);
          const nw = Math.min(maxW, Math.max(420, origW + (ev.clientX - startX)));
          const nh = Math.min(maxH, Math.max(420, origH + (ev.clientY - startY)));
          device.style.width = `${nw}px`;
          device.style.height = `${nh}px`;
          device.style.maxWidth = 'none';
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    },

    openApp(appId) {
      const app = this.apps[appId];
      if (!app) return;

      // If already open: focus and restore
      for (const [winId, winState] of this.windows.entries()) {
        if (winState.appId === appId) {
          this.restoreWindow(winId);
          this.focusWindow(winId);
          return;
        }
      }

      const winId = `${appId}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const size = app.defaultSize || { w: 520, h: 360 };
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      const safeWidth = Math.max(320, window.innerWidth - (isMobile ? 20 : 80));
      const safeHeight = Math.max(220, window.innerHeight - (isMobile ? 84 : 110));
      const windowWidth = Math.min(size.w, safeWidth);
      const windowHeight = Math.min(size.h, safeHeight);

      const state = {
        winId,
        appId,
        title: app.name,
        minimized: false,
        maximized: false,
        x: isMobile ? 10 : Math.max(20, Math.round((window.innerWidth - windowWidth) / 2) + Math.floor(Math.random() * 20) - 10),
        y: isMobile ? 62 : Math.max(20, Math.round((window.innerHeight - windowHeight) / 2) + Math.floor(Math.random() * 20) - 10),
        w: windowWidth,
        h: windowHeight,
        prev: null,
        cleanup: [],
        focusHandlers: []
      };

      const win = this.createWindowEl(state);
      document.body.appendChild(win);
      this.windows.set(winId, { ...state, el: win });

      this.createTaskbarItem(state);
      this.focusWindow(winId);

      const ctx = {
        onClose: (fn) => state.cleanup.push(fn),
        onFocus: (fn) => state.focusHandlers.push(fn)
      };

      const content = app.render(ctx);
      const contentHost = $('.os-window-content', win);
      if (contentHost && content) contentHost.appendChild(content);

      return winId;
    },

    createTaskbarItem(state) {
      if (!this.taskbar) return;
      const btn = document.createElement('button');
      const app = this.apps[state.appId] || {};
      const iconClass = app.taskbarIcon || 'taskbar-shape-square';
      btn.type = 'button';
      btn.className = 'os-task-item';
      btn.dataset.winId = state.winId;
      btn.innerHTML = `<span class="os-task-icon ${iconClass}"></span><span class="os-task-name">${state.title}</span>`;
      btn.addEventListener('click', () => {
        const winState = this.windows.get(state.winId);
        if (!winState) return;
        if (winState.minimized) {
          this.restoreWindow(state.winId);
          this.focusWindow(state.winId);
        } else {
          this.minimizeWindow(state.winId);
        }
      });
      this.taskbar.appendChild(btn);
      this.taskbarItems.set(state.winId, btn);
    },

    createWindowEl(state) {
      const win = document.createElement('div');
      win.className = 'os-window';
      win.dataset.winId = state.winId;
      win.style.left = `${state.x}px`;
      win.style.top = `${state.y}px`;
      win.style.width = `${state.w}px`;
      win.style.height = `${state.h}px`;
      win.style.zIndex = String(++this.zTop);

      win.innerHTML = `
        <div class="os-window-titlebar" data-role="titlebar">
          <div class="os-window-title">${state.title}</div>
          <div class="os-window-controls">
            <button class="os-win-btn" type="button" data-action="min">_</button>
            <button class="os-win-btn" type="button" data-action="max">▢</button>
            <button class="os-win-btn danger" type="button" data-action="close">X</button>
          </div>
        </div>
        <div class="os-window-content"></div>
        <div class="os-resize-handle" data-handle="se"></div>
      `;

      const titlebar = $('[data-role="titlebar"]', win);
      const handle = $('.os-resize-handle', win);

      // controls
      win.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === 'close') this.closeWindow(state.winId);
        if (action === 'min') this.minimizeWindow(state.winId);
        if (action === 'max') {
          const st = this.windows.get(state.winId);
          if (!st) return;
          if (st.maximized) this.restoreFromMax(state.winId);
          else this.maximizeWindow(state.winId);
        }
      });

      // drag
      if (titlebar) {
        titlebar.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          const st = this.windows.get(state.winId);
          if (!st || st.minimized || st.maximized) return;
          const startX = e.clientX;
          const startY = e.clientY;
          const origX = st.x;
          const origY = st.y;
          const onMove = (ev) => {
            const nx = origX + (ev.clientX - startX);
            const ny = origY + (ev.clientY - startY);
            this.setWindowPos(state.winId, nx, ny);
          };
          const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          };
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }

      // resize (SE)
      if (handle) {
        handle.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          const st = this.windows.get(state.winId);
          if (!st || st.minimized || st.maximized) return;
          e.preventDefault();
          const startX = e.clientX;
          const startY = e.clientY;
          const origW = st.w;
          const origH = st.h;
          const onMove = (ev) => {
            const nw = Math.max(320, origW + (ev.clientX - startX));
            const nh = Math.max(200, origH + (ev.clientY - startY));
            this.setWindowSize(state.winId, nw, nh);
          };
          const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          };
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }

      return win;
    },

    setWindowPos(winId, x, y) {
      const st = this.windows.get(winId);
      if (!st) return;
      const maxX = Math.max(0, window.innerWidth - st.w - 8);
      const maxY = Math.max(0, window.innerHeight - st.h - 48);
      st.x = Math.min(Math.max(0, x), maxX);
      st.y = Math.min(Math.max(0, y), maxY);
      st.el.style.left = `${st.x}px`;
      st.el.style.top = `${st.y}px`;
    },

    setWindowSize(winId, w, h) {
      const st = this.windows.get(winId);
      if (!st) return;
      const maxW = Math.max(320, window.innerWidth - 24);
      const maxH = Math.max(200, window.innerHeight - 64);
      st.w = Math.min(w, maxW);
      st.h = Math.min(h, maxH);
      st.el.style.width = `${st.w}px`;
      st.el.style.height = `${st.h}px`;
      this.setWindowPos(winId, st.x, st.y);
    },

    focusWindow(winId) {
      const st = this.windows.get(winId);
      if (!st || st.minimized) return;
      this.activeWindowId = winId;
      st.el.style.zIndex = String(++this.zTop);
      $$('.os-window').forEach((w) => w.classList.remove('active'));
      st.el.classList.add('active');

      // taskbar highlight
      this.taskbarItems.forEach((btn) => btn.classList.remove('active'));
      const tb = this.taskbarItems.get(winId);
      if (tb) tb.classList.add('active');

      (st.focusHandlers || []).forEach((fn) => {
        try { fn(); } catch {}
      });
    },

    minimizeWindow(winId) {
      const st = this.windows.get(winId);
      if (!st) return;
      st.minimized = true;
      st.el.style.display = 'none';
      const tb = this.taskbarItems.get(winId);
      if (tb) tb.classList.remove('active');
      if (this.activeWindowId === winId) this.activeWindowId = null;
    },

    restoreWindow(winId) {
      const st = this.windows.get(winId);
      if (!st) return;
      st.minimized = false;
      st.el.style.display = '';
    },

    maximizeWindow(winId) {
      const st = this.windows.get(winId);
      if (!st) return;
      if (st.maximized) return;
      st.prev = { x: st.x, y: st.y, w: st.w, h: st.h };
      st.maximized = true;
      st.el.classList.add('max');
      // fill safe area (avoid taskbar)
      const safeBottom = 46;
      st.x = 10;
      st.y = 10;
      st.w = Math.max(360, window.innerWidth - 20);
      st.h = Math.max(240, window.innerHeight - safeBottom - 20);
      st.el.style.left = `${st.x}px`;
      st.el.style.top = `${st.y}px`;
      st.el.style.width = `${st.w}px`;
      st.el.style.height = `${st.h}px`;
    },

    restoreFromMax(winId) {
      const st = this.windows.get(winId);
      if (!st || !st.maximized) return;
      st.maximized = false;
      st.el.classList.remove('max');
      if (st.prev) {
        this.setWindowPos(winId, st.prev.x, st.prev.y);
        this.setWindowSize(winId, st.prev.w, st.prev.h);
      }
      st.prev = null;
    },

    closeWindow(winId) {
      const st = this.windows.get(winId);
      if (!st) return;
      (st.cleanup || []).forEach((fn) => {
        try { fn(); } catch {}
      });
      st.el.remove();
      this.windows.delete(winId);
      const tb = this.taskbarItems.get(winId);
      if (tb) tb.remove();
      this.taskbarItems.delete(winId);
      if (this.activeWindowId === winId) this.activeWindowId = null;
    }
  };

  window.ShapeOS = OS;

  document.addEventListener('DOMContentLoaded', () => {
    OS.init();

    // jitter effect for Internet window text (global keyframes already in CSS)
    const observer = new MutationObserver(() => {
      const node = document.getElementById('netWarningText');
      if (node) node.classList.add('jitter');
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
