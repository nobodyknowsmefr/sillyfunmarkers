// ShapeTalk Chat System
const Chat = {
    username: null,
    userId: null,
    currentMood: ':happy:',
    currentRoom: 'Lobby',
    messageInput: null,
    chatMessages: null,
    emojiPicker: null,
    drawPicker: null,
    userList: null,
    userListHeader: null,
    previewText: null,
    roomName: null,
    dmName: null,
    chatContextBar: null,
    chatContextName: null,
    roomMenuWrap: null,
    roomMenu: null,
    roomOccupancy: {},
    yourName: null,
    moodSelect: null,
    moodOptions: null,
    moodMenuWrap: null,
    nativeKeyboardBtn: null,
    sendBtnMobile: null,
    sendBtnDesktop: null,
    copyBtnMobile: null,
    pasteBtnMobile: null,
    keyboardToggleBtn: null,
    keyboardArea: null,
    emojiToggleIcon: null,
    capsLock: false,
    shift: false,
    nativeKeyboardRequested: false,
    keyboardVisible: true,
    keyboardMode: 'letters',

    appAudioEnabled: true,
    audioCtx: null,

    canvas: null,
    ctx: null,
    isDrawing: false,
    currentTool: 'pen',
    currentColor: '#000000',
    currentSize: 4,
    lastX: 0,
    lastY: 0,
    hasDrawn: false,

    ws: null,
    serverId: null,
    watching: false,
    watchRoom: null,
    _watchHistory: null,
    watchUsersRef: null,
    watchMessagesRef: null,
    watchUserListener: null,
    watchMessageListener: null,
    watchPresenceRef: null,
    watchSeenMessageKeys: null,
    demoWatchTimers: [],
    renameCooldownMs: 5 * 60 * 1000,
    nameHackCooldownMs: 15 * 60 * 1000,
    renameCooldownStorageKey: 'shapetalk_rename_last_used_at',
    nameHackStorageKey: 'shapetalk_namehack_last_used_at',
    currentReplyTarget: null,
    replyPreview: null,
    replyPreviewText: null,
    replyCancelBtn: null,
    messageElements: {},
    messageCache: {},
    messageBgColor: null,
    reactionChoices: [':happy:', ':sad:', ':wink:', ':confused:', ':love:', ':question:', ':exclaim:', ':redshape:', ':greenshape:'],
    dmRooms: [],
    roomMenuDmList: null,
    lastMainRoom: 'Lobby',
    lastMainRoomUsers: [],
    lastDmRoom: null,
    activePane: 'room',
    dmUnreadRooms: {},
    mainRoomUnread: false,
    inactiveRoomListeners: {},
    lastLobbySpeaker: null,
    dmRoomColors: {},

    demoConversations: [
        {
            room: 'Shapes',
            users: ['DiamondDude421', 'TriangleKing007'],
            messages: [
                { sender: 'DiamondDude421', text: 'yo did you see that new game dropping tomorrow', delay: 900 },
                { sender: 'TriangleKing007', text: 'yeah bro the trailer looks crazy', delay: 2400 },
                { sender: 'DiamondDude421', text: 'i have a better concept for it though', delay: 4100 },
                { sender: 'TriangleKing007', text: 'what idea', delay: 5500 },
                { sender: 'DiamondDude421', text: 'what if the whole map changes every 5 min and nobody gets warned', delay: 7200 },
                { sender: 'TriangleKing007', text: 'bro that is actually genius', delay: 8900 },
                { sender: 'DiamondDude421', text: 'i been sitting on this for three weeks', delay: 10600 },
                { sender: 'TriangleKing007', text: 'dont tell nobody. we build this ourselves', delay: 12400 }
            ]
        },
        {
            room: 'AfterHours',
            users: ['OctagonWizard333', 'CircleSage099'],
            messages: [
                { sender: 'CircleSage099', text: 'i wrote a whole song last night, couldnt sleep', delay: 700 },
                { sender: 'OctagonWizard333', text: 'for real? what kind', delay: 2000 },
                { sender: 'CircleSage099', text: 'slow beat with weird samples from old cartoons', delay: 3700 },
                { sender: 'OctagonWizard333', text: 'that sounds genuinely different', delay: 5300 },
                { sender: 'CircleSage099', text: 'i call the whole sound shape wave', delay: 6800 },
                { sender: 'OctagonWizard333', text: 'thats a whole genre right there', delay: 8500 },
                { sender: 'CircleSage099', text: 'right? nobody is doing this', delay: 10100 },
                { sender: 'OctagonWizard333', text: 'drop it before someone steals it', delay: 11900 }
            ]
        },
        {
            room: 'SketchPad',
            users: ['HexagonHorse212', 'StarLegend556'],
            messages: [
                { sender: 'HexagonHorse212', text: 'imagine an app that shows what your friends are doing in real time', delay: 800 },
                { sender: 'StarLegend556', text: 'like a spy app lmao', delay: 2200 },
                { sender: 'HexagonHorse212', text: 'no tasteful. what they listening to, watching, reading', delay: 3900 },
                { sender: 'StarLegend556', text: 'thats actually a cool idea ngl', delay: 5500 },
                { sender: 'HexagonHorse212', text: 'call it Parallel', delay: 7000 },
                { sender: 'StarLegend556', text: 'parallel. ok i fw that hard', delay: 8700 },
                { sender: 'HexagonHorse212', text: 'gonna mock it up tonight', delay: 10300 },
                { sender: 'StarLegend556', text: 'let me know when you have something', delay: 12000 }
            ]
        }
    ],

    onlineUsers: [],
    aiReplyTimer: null,
    aiUser: {
        id: 'shape_ai',
        username: 'ShapeBot000',
        mood: ':cool:'
    },
    aiResponses: [
        'I am here if you want to keep the room warm. :cool:',
        'Say anything and I will keep the conversation moving. :happy:',
        'The room is quiet, but I am listening. :wink:',
        'That sounds good to me. :thumbsup:',
        'I can hang here until more people join. :music:',
        'Interesting thought. Keep going. :star:',
        'I am still online with you. :happy:',
        'That works for me. :cool:',
        'Nice. I am ready for the next message. :wink:',
        'All clear in here so far. :fire:'
    ],

    roomConfigs: {
        'Lobby': { maxUsers: null, mode: 'open', maxMessages: null },
        'DMs': { maxUsers: null, mode: 'open', maxMessages: null },
        'ShapeTalk': { maxUsers: null, mode: 'emoji_draw_only', maxMessages: null },
        'VIP': { maxUsers: null, mode: 'open', maxMessages: 100 },
        'Private 1': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 2': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 3': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 4': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 5': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 6': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 7': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 8': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 9': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true },
        'Private 10': { maxUsers: 2, mode: 'open', maxMessages: null, ephemeral: true }
    },

    mainRooms: ['Lobby', 'ShapeTalk', 'VIP'],

    init() {
        // Get DOM elements
        this.messageInput = document.getElementById('messageInput');
        this.chatMessages = document.getElementById('chatMessages');
        this.emojiPicker = document.getElementById('emojiPicker');
        this.drawPicker = document.getElementById('drawPicker');
        this.userList = document.getElementById('userList');
        this.userListHeader = document.getElementById('userListHeader');
        this.previewText = document.getElementById('previewText');
        this.replyPreview = document.getElementById('replyPreview');
        this.replyPreviewText = document.getElementById('replyPreviewText');
        this.replyCancelBtn = document.getElementById('replyCancelBtn');
        this.roomName = document.getElementById('roomName');
        this.dmName = document.getElementById('dmName');
        this.chatContextBar = document.getElementById('chatContextBar');
        this.chatContextName = document.getElementById('chatContextName');
        this.roomMenuWrap = document.getElementById('roomMenuWrap');
        this.roomMenu = document.getElementById('roomMenu');
        this.yourName = document.getElementById('yourName');
        this.moodSelect = document.getElementById('moodSelect');
        this.moodOptions = document.getElementById('moodOptions');
        this.moodMenuWrap = document.getElementById('moodMenuWrap');
        this.nativeKeyboardBtn = document.getElementById('nativeKeyboardBtn');
        this.sendBtnMobile = document.getElementById('sendBtnMobile');
        this.sendBtnDesktop = document.getElementById('sendBtnDesktop');
        this.copyBtnMobile = document.getElementById('copyBtnMobile');
        this.pasteBtnMobile = document.getElementById('pasteBtnMobile');
        this.keyboardToggleBtn = document.getElementById('keyboardToggleBtn');
        this.keyboardArea = document.getElementById('keyboardArea');
        this.emojiToggleIcon = document.getElementById('emojiToggleIcon');
        this.buildVersionBtn = document.getElementById('buildVersion');

        // Generate or retrieve username
        this.username = NameGenerator.getOrCreateUsername();
        this.userId = 'session_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
        this.currentMood = this.moodSelect ? this.moodSelect.value : ':happy:';
        this.keyboardVisible = true;
        this.renderMoodMenuOptions();
        this.renderOwnIdentity();
        this.setCurrentRoom(this.currentRoom);
        this.updateRoomMenuOccupancy();

        // Add self to user list
        this.updateUserList([this.getSelfUser()]);

        this.syncInputAccessibility();
        this.syncKeyboardVisibility();

        // Setup event listeners
        this.setupEventListeners();
        this.setupKeyboard();
        this.setupCanvas();
        this.setupVistaDesktop();
        
        // Initialize Firebase chat if available
        if (window.FirebaseChat) {
            const firebaseConnected = window.FirebaseChat.init({
                userId: this.userId,
                username: this.username,
                mood: this.currentMood
            });
            if (firebaseConnected) {
                this.userId = window.FirebaseChat.userId || this.userId;
                if (typeof window.FirebaseChat.listenForRoomList === 'function') {
                    window.FirebaseChat.listenForRoomList((roomNames) => {
                        roomNames.forEach((roomName) => {
                            if (this.isDmRoom(roomName) && roomName.includes(this.username)) {
                                this.registerDmRoom(roomName);
                            }
                        });
                    });
                }
                console.log('Connected to Firebase real-time chat');
            } else {
                console.log('Firebase not configured, using local test mode');
                this.connectWS();
            }
        } else {
            this.connectWS();
        }
        
        // Initialize emoji picker
        EmojiSystem.initPicker('emojiGrid', (code) => {
            this.insertEmoji(code);
        });
        
        // Welcome message
        this.addSystemMessage(`You joined ${this.currentRoom} as ${this.username}.`);
        
        // Update preview initially
        this.updatePreview();
        this.updateKeyLabels();
        this.updateEmojiKeyboardState();
        
        // Focus the input so physical keyboard works
        if (!this.shouldBlockNativeKeyboard()) {
            this.messageInput.focus();
        }
        
        // Re-focus input when clicking on keyboard area
        this.keyboardArea.addEventListener('click', (e) => {
            if (e.target.closest('.key') || e.target.closest('.side-btn') || e.target.closest('.emoji-picker') || e.target.closest('.draw-picker') || e.target.closest('.mood-menu-wrap')) {
                if (this.isMobileViewport()) {
                    this.messageInput.blur();
                }
                return;
            }

            if (this.isMobileViewport()) {
                if (this.nativeKeyboardRequested) {
                    this.messageInput.focus();
                } else {
                    this.messageInput.blur();
                }
                return;
            }

            this.messageInput.focus();
        });
        
        // Re-focus input when clicking on preview
        document.querySelector('.message-preview').addEventListener('click', () => {
            if (this.shouldBlockNativeKeyboard()) {
                this.messageInput.blur();
                return;
            }
            this.messageInput.focus();
        });

        // Eavesdrop controls
        const stealBtn = document.getElementById('stealBtn');
        if (stealBtn) stealBtn.addEventListener('click', () => this.doStealIdeas());
        const eavesdropStop = document.getElementById('eavesdropStop');
        if (eavesdropStop) eavesdropStop.addEventListener('click', () => this.stopWatching());
    },

    setupVistaDesktop() {
        const timeNodes = {
            mainTime: document.getElementById('vistaTime'),
            mainDate: document.getElementById('vistaDate'),
            trayTime: document.getElementById('vistaTrayTime'),
            trayDate: document.getElementById('vistaTrayDate')
        };

        const monthNode = document.getElementById('vistaCalMonth');
        const yearNode = document.getElementById('vistaCalYear');
        const gridNode = document.getElementById('vistaCalGrid');

        const updateClock = () => {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
            if (timeNodes.mainTime) timeNodes.mainTime.textContent = time;
            if (timeNodes.trayTime) timeNodes.trayTime.textContent = time;
            if (timeNodes.mainDate) timeNodes.mainDate.textContent = date;
            if (timeNodes.trayDate) timeNodes.trayDate.textContent = now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
        };

        const renderCalendar = () => {
            if (!monthNode || !yearNode || !gridNode) return;
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const firstOfMonth = new Date(year, month, 1);
            const startDay = firstOfMonth.getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate();
            const monthLabel = now.toLocaleDateString([], { month: 'long' });

            monthNode.textContent = monthLabel;
            yearNode.textContent = String(year);

            gridNode.innerHTML = '';
            const totalCells = 42;
            const today = now.getDate();

            for (let i = 0; i < totalCells; i += 1) {
                const cell = document.createElement('div');
                cell.className = 'cal-cell';
                const dayNumber = i - startDay + 1;

                if (dayNumber <= 0) {
                    cell.classList.add('muted');
                    cell.textContent = String(daysInPrevMonth + dayNumber);
                } else if (dayNumber > daysInMonth) {
                    cell.classList.add('muted');
                    cell.textContent = String(dayNumber - daysInMonth);
                } else {
                    cell.textContent = String(dayNumber);
                    if (dayNumber === today) cell.classList.add('today');
                }

                gridNode.appendChild(cell);
            }
        };

        updateClock();
        renderCalendar();
        setInterval(updateClock, 1000);
    },

    setupEventListeners() {
        if (this.sendBtnMobile) {
            this.sendBtnMobile.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (this.sendBtnDesktop) {
            this.sendBtnDesktop.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (this.replyCancelBtn) {
            this.replyCancelBtn.addEventListener('click', () => {
                this.clearReplyTarget();
            });
        }

        if (this.copyBtnMobile) {
            this.copyBtnMobile.addEventListener('click', async () => {
                const draftText = this.messageInput ? this.messageInput.value : '';
                if (!draftText) return;
                try {
                    await navigator.clipboard.writeText(draftText);
                    this.addSystemMessage('Draft copied.');
                } catch (_) {
                    try {
                        this.messageInput.focus({ preventScroll: true });
                        this.messageInput.select();
                        document.execCommand('copy');
                        this.messageInput.setSelectionRange(draftText.length, draftText.length);
                        this.addSystemMessage('Draft copied.');
                    } catch (_) {
                        this.addSystemMessage('Copy failed on this device.');
                    }
                }
            });
        }

        if (this.pasteBtnMobile) {
            this.pasteBtnMobile.addEventListener('click', async () => {
                let pastedText = '';
                try {
                    pastedText = await navigator.clipboard.readText();
                } catch (_) {}
                if (!pastedText) {
                    this.addSystemMessage('Paste from clipboard was blocked. Tap the textbox and use your phone paste option.');
                    return;
                }
                const start = this.messageInput.selectionStart || this.messageInput.value.length;
                const end = this.messageInput.selectionEnd || this.messageInput.value.length;
                const nextValue = `${this.messageInput.value.slice(0, start)}${pastedText}${this.messageInput.value.slice(end)}`;
                this.messageInput.value = nextValue.slice(0, this.messageInput.maxLength || nextValue.length);
                const caret = Math.min(start + pastedText.length, this.messageInput.value.length);
                this.messageInput.setSelectionRange(caret, caret);
                this.updatePreview();
            });
        }

        if (this.buildVersionBtn) {
            this.buildVersionBtn.addEventListener('click', () => {
                const url = new URL(window.location.href);
                url.searchParams.set('v', String(Date.now()));
                window.location.replace(url.toString());
            });
        }

        if (this.keyboardToggleBtn) {
            this.keyboardToggleBtn.addEventListener('click', () => {
                this.nativeKeyboardRequested = false;
                this.syncInputAccessibility();
                this.messageInput.blur();
                if (this.keyboardVisible) {
                    this.toggleKeyboardVisible(false);
                } else {
                    this.toggleKeyboardVisible(true);
                }
            });
        }

        if (window.matchMedia) {
            const mobileQuery = window.matchMedia('(max-width: 900px)');
            const onChange = () => {
                this.keyboardVisible = true;
                this.nativeKeyboardRequested = false;
                this.syncInputAccessibility();
                this.syncKeyboardVisibility();
            };
            if (typeof mobileQuery.addEventListener === 'function') {
                mobileQuery.addEventListener('change', onChange);
            } else if (typeof mobileQuery.addListener === 'function') {
                mobileQuery.addListener(onChange);
            }
        }

        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.messageInput.value = '';
                this.updatePreview();
            });
        }

        // Emoji button toggle
        document.getElementById('emojiBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.keyboardMode = this.keyboardMode === 'letters' ? 'emoji' : 'letters';
            this.updateEmojiKeyboardState();
            document.getElementById('emojiBtn').classList.toggle('active');
            this.emojiPicker.classList.remove('active');

            if (this.drawPicker) {
                this.drawPicker.classList.remove('active');
                const drawBtn = document.getElementById('drawBtn');
                if (drawBtn) drawBtn.classList.remove('active');
            }
        });

        const drawBtn = document.getElementById('drawBtn');
        if (drawBtn && this.drawPicker) {
            drawBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.drawPicker.classList.toggle('active');
                drawBtn.classList.toggle('active');

                this.emojiPicker.classList.remove('active');
                this.keyboardMode = 'letters';
                this.updateEmojiKeyboardState();
                document.getElementById('emojiBtn').classList.remove('active');
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.emoji-picker') && !e.target.closest('.emoji-toggle')) {
                this.emojiPicker.classList.remove('active');
            }

            if (this.drawPicker && !e.target.closest('.draw-picker') && !e.target.closest('.draw-toggle')) {
                this.drawPicker.classList.remove('active');
                const drawBtn = document.getElementById('drawBtn');
                if (drawBtn) drawBtn.classList.remove('active');
            }

            if (!e.target.closest('.mood-menu-wrap') && !e.target.closest('#yourName')) {
                this.closeMoodMenu();
            }

            if (!e.target.closest('.room-menu-wrap') && !e.target.closest('#roomName')) {
                this.closeRoomMenu();
            }

        });

        // Rename button
        document.getElementById('renameBtn').addEventListener('click', () => {
            this.regenerateName();
        });

        if (this.moodSelect) {
            this.moodSelect.addEventListener('change', () => {
                this.setMood(this.moodSelect.value || ':happy:');
                this.closeMoodMenu();
            });
        }

        if (this.yourName) {
            this.yourName.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMoodMenu();
            });
        }

        if (this.roomName) {
            this.roomName.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (this.activePane !== 'room') {
                    await this.switchToRoomPane();
                    return;
                }
                this.toggleRoomMenu();
            });
        }

        if (this.dmName) {
            this.dmName.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (this.activePane !== 'dm') {
                    await this.switchToDmPane();
                    return;
                }
            });
        }

        if (this.roomMenu) {
            this.roomMenu.querySelectorAll('[data-room]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    await this.selectRoom(btn.dataset.room);
                });
            });
        }

        if (this.nativeKeyboardBtn) {
            const handleNativeKeyboardTrigger = (e) => {
                if (e) {
                    e.stopPropagation();
                }
                this.focusNativeKeyboard();
            };

            this.nativeKeyboardBtn.addEventListener('pointerdown', handleNativeKeyboardTrigger);
            this.nativeKeyboardBtn.addEventListener('touchstart', handleNativeKeyboardTrigger, { passive: true });
            this.nativeKeyboardBtn.addEventListener('click', handleNativeKeyboardTrigger);
        }

        // Physical keyboard input - update preview and highlight keys
        document.addEventListener('keydown', (e) => {
            this.highlightKey(e.key, true);
            this.playKeySound(e.key);
            
            // Handle special keys
            if (e.key === 'CapsLock') {
                this.capsLock = !this.capsLock;
                this.updateCapsDisplay();
            }
            if (e.key === 'Shift') {
                this.shift = true;
                this.updateShiftDisplay();
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.highlightKey(e.key, false);
            
            if (e.key === 'Shift') {
                this.shift = false;
                this.updateShiftDisplay();
            }
            
            // Update preview after any key
            this.updatePreview();
        });

        // Update preview on input change
        this.messageInput.addEventListener('input', () => {
            this.updatePreview();
        });

        this.messageInput.addEventListener('paste', (e) => {
            const pastedText = e.clipboardData && typeof e.clipboardData.getData === 'function'
                ? e.clipboardData.getData('text')
                : '';
            if (!pastedText) return;
            e.preventDefault();
            const start = this.messageInput.selectionStart || this.messageInput.value.length;
            const end = this.messageInput.selectionEnd || this.messageInput.value.length;
            const nextValue = `${this.messageInput.value.slice(0, start)}${pastedText}${this.messageInput.value.slice(end)}`;
            this.messageInput.value = nextValue.slice(0, this.messageInput.maxLength || nextValue.length);
            const caret = Math.min(start + pastedText.length, this.messageInput.value.length);
            this.messageInput.setSelectionRange(caret, caret);
            this.updatePreview();
        });

        let lastTouchEndAt = 0;
        document.addEventListener('touchend', (e) => {
            if (!this.isMobileViewport()) return;
            const interactiveTarget = e.target.closest('.key, .side-btn, .preview-action-btn, .room-name, .room-menu-item, .mood-option-btn, .pic-btn, .pic-tile, #messageInput');
            if (!interactiveTarget) return;
            const now = Date.now();
            if (now - lastTouchEndAt < 320) {
                e.preventDefault();
            }
            lastTouchEndAt = now;
        }, { passive: false });

        this.messageInput.addEventListener('focus', () => {
            this.closeMoodMenu();
        });

        if (this.chatMessages) {
            this.chatMessages.addEventListener('click', (e) => {
                const replyBtn = e.target.closest('[data-action="replyMessage"]');
                if (replyBtn) {
                    const messageId = replyBtn.dataset.messageId;
                    if (messageId && this.messageCache[messageId]) {
                        this.setReplyTarget(this.messageCache[messageId]);
                    }
                    return;
                }

                const reactionToggle = e.target.closest('[data-action="toggleReactionPicker"]');
                if (reactionToggle) {
                    const messageEl = reactionToggle.closest('.message');
                    if (messageEl) {
                        messageEl.classList.toggle('reactions-open');
                    }
                    return;
                }

                const reactionBtn = e.target.closest('[data-action="reactToMessage"]');
                if (reactionBtn) {
                    const messageId = reactionBtn.dataset.messageId;
                    const reaction = reactionBtn.dataset.reaction;
                    if (messageId && reaction) {
                        this.applyReaction(messageId, reaction);
                    }
                    return;
                }
            });
        }
    },

    toggleMoodMenu() {
        if (!this.moodMenuWrap) return;
        const shouldOpen = !this.moodMenuWrap.classList.contains('open');
        this.moodMenuWrap.classList.toggle('open', shouldOpen);
        if (shouldOpen) {
            this.closeRoomMenu();
        }
        this.updateMoodOptionSelection();
    },

    closeMoodMenu() {
        if (!this.moodMenuWrap) return;
        this.moodMenuWrap.classList.remove('open');
    },

    renderMoodMenuOptions() {
        if (!this.moodSelect || !this.moodOptions) return;
        this.moodOptions.innerHTML = '';
        Array.from(this.moodSelect.options).forEach((option) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'mood-option-btn';
            btn.dataset.mood = option.value;
            btn.innerHTML = `${this.renderMoodEmoji(option.value)} <span class="mood-option-name">${this.escapeHtml(option.textContent || option.value)}</span>`;
            btn.addEventListener('click', () => {
                this.setMood(option.value);
                this.closeMoodMenu();
            });
            this.moodOptions.appendChild(btn);
        });
        this.updateMoodOptionSelection();
    },

    updateMoodOptionSelection() {
        if (!this.moodOptions) return;
        this.moodOptions.querySelectorAll('.mood-option-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.mood === this.currentMood);
        });
    },

    toggleRoomMenu() {
        if (!this.roomMenu) return;
        const shouldOpen = this.roomMenu.hasAttribute('hidden');
        if (shouldOpen) {
            this.closeMoodMenu();
            this.updateRoomMenuOccupancy();
        }
        this.roomMenu.toggleAttribute('hidden', !shouldOpen);
    },

    closeRoomMenu() {
        if (!this.roomMenu) return;
        this.roomMenu.setAttribute('hidden', '');
    },

    getRoomConfig(roomName) {
        return this.roomConfigs[roomName] || this.roomConfigs.Lobby;
    },

    isMainRoom(roomName = this.currentRoom) {
        return this.mainRooms.includes(roomName);
    },

    isDmRoom(roomName = this.currentRoom) {
        return String(roomName || '').startsWith('DM:');
    },

    slugifyName(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'user';
    },

    buildDmRoomName(otherUsername) {
        const names = [this.username, otherUsername].map((name) => String(name || '').trim()).sort((a, b) => a.localeCompare(b));
        return `DM: ${names[0]} & ${names[1]}`;
    },

    getDmPartnerName(roomName) {
        const raw = String(roomName || '').replace(/^DM:\s*/, '');
        const names = raw.split('&').map((part) => part.trim()).filter(Boolean);
        const partner = names.find((name) => name !== this.username);
        return partner || names[0] || 'DM';
    },

    registerDmRoom(roomName) {
        this.closeRoomMenu();
        if (!roomName || !this.isDmRoom(roomName)) return;
        if (!this.dmRooms.includes(roomName)) {
            this.dmRooms.push(roomName);
            this.dmRooms.sort((a, b) => a.localeCompare(b));
        }
        this.lastDmRoom = roomName;
        this.ensureInactiveRoomListeners();
    },

    async openDirectMessage(user) {
        const target = this.normalizeUser(user);
        if (!target || !target.username || target.username === this.username) return;
        const roomName = this.buildDmRoomName(target.username);
        this.registerDmRoom(roomName);
        await this.selectRoom(roomName);
    },

    async startNewDmFromLobbySpeaker() {
        const target = this.lastLobbySpeaker;
        if (!target || !target.username || target.username === this.username) return;
        await this.openDirectMessage(target);
    },

    async closeDmRoom(roomName) {
        if (!roomName || !this.isDmRoom(roomName)) return;
        this.dmRooms = this.dmRooms.filter((name) => name !== roomName);
        delete this.dmUnreadRooms[roomName];
        delete this.dmRoomColors[roomName];
        this.detachInactiveRoomListener(roomName);
        if (this.lastDmRoom === roomName) {
            this.lastDmRoom = this.dmRooms[0] || null;
        }
        if (this.currentRoom === roomName) {
            if (this.lastDmRoom) {
                await this.selectRoom(this.lastDmRoom);
            } else {
                const fallbackRoom = this.lastMainRoom || 'Lobby';
                if (this.currentRoom !== fallbackRoom) {
                    await this.selectRoom(fallbackRoom);
                }
                this.activePane = 'dm';
                this.renderCurrentRoomLabel();
            }
            return;
        }
        this.renderCurrentRoomLabel();
    },

    async switchToRoomPane() {
        const nextRoom = this.lastMainRoom || 'Lobby';
        if (this.currentRoom === nextRoom) {
            this.activePane = 'room';
            this.renderCurrentRoomLabel();
            return;
        }
        await this.selectRoom(nextRoom);
    },

    async switchToDmPane() {
        this.closeRoomMenu();
        const unreadDmRoom = Object.keys(this.dmUnreadRooms)[0] || null;
        const targetDmRoom = this.lastDmRoom || unreadDmRoom || this.dmRooms[0] || null;
        if (targetDmRoom) {
            this.lastDmRoom = targetDmRoom;
            if (this.currentRoom === targetDmRoom) {
                this.activePane = 'dm';
                this.renderCurrentRoomLabel();
                return;
            }
            await this.selectRoom(targetDmRoom);
            return;
        }
        this.activePane = 'dm';
        this.renderCurrentRoomLabel();
    },

    markRoomUnread(roomName) {
        if (!roomName) return;
        if (this.isDmRoom(roomName)) {
            this.dmUnreadRooms[roomName] = true;
        } else if (roomName === this.lastMainRoom) {
            this.mainRoomUnread = true;
        }
        this.renderCurrentRoomLabel();
    },

    clearRoomUnread(roomName) {
        if (!roomName) return;
        if (this.isDmRoom(roomName)) {
            delete this.dmUnreadRooms[roomName];
        } else if (roomName === this.lastMainRoom) {
            this.mainRoomUnread = false;
        }
    },

    attachInactiveRoomListener(roomName) {
        if (!window.FirebaseChat || !window.FirebaseChat.database || !roomName || this.inactiveRoomListeners[roomName]) return;
        const query = window.FirebaseChat.database.ref(`rooms/${roomName}/messages`).limitToLast(50);
        const knownKeys = new Set();
        const handler = (snapshot) => {
            if (knownKeys.has(snapshot.key)) return;
            knownKeys.add(snapshot.key);
            const message = snapshot.val() || {};
            const isOwnMessage = message.userId ? message.userId === this.userId : message.username === this.username;
            if (isOwnMessage || this.currentRoom === roomName) return;
            this.markRoomUnread(roomName);
        };

        query.once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                knownKeys.add(childSnapshot.key);
            });
            query.on('child_added', handler);
            this.inactiveRoomListeners[roomName] = { query, handler };
        });
    },

    detachInactiveRoomListener(roomName) {
        const listener = this.inactiveRoomListeners[roomName];
        if (!listener) return;
        listener.query.off('child_added', listener.handler);
        delete this.inactiveRoomListeners[roomName];
    },

    ensureInactiveRoomListeners() {
        const targets = new Set(this.dmRooms);
        if (this.lastMainRoom) {
            targets.add(this.lastMainRoom);
        }
        Object.keys(this.inactiveRoomListeners).forEach((roomName) => {
            if (!targets.has(roomName)) {
                this.detachInactiveRoomListener(roomName);
            }
        });
        targets.forEach((roomName) => {
            this.attachInactiveRoomListener(roomName);
        });
    },

    getMoodClassName(mood) {
        return `mood-${String(mood || ':happy:').replace(/:/g, '').replace(/[^a-z0-9_-]/gi, '').toLowerCase()}`;
    },

    getStorageNumber(key, useSession = false) {
        try {
            const storage = useSession ? window.sessionStorage : window.localStorage;
            const value = storage.getItem(key);
            return value ? Number(value) : 0;
        } catch (_) {
            return 0;
        }
    },

    setStorageNumber(key, value, useSession = false) {
        try {
            const storage = useSession ? window.sessionStorage : window.localStorage;
            storage.setItem(key, String(value));
        } catch (_) {}
    },

    getRemainingCooldown(ms, key, useSession = false) {
        const lastUsed = this.getStorageNumber(key, useSession);
        const remaining = Math.max(0, ms - (Date.now() - lastUsed));
        return remaining;
    },

    formatCooldown(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes > 0) {
            return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
        }
        return `${seconds}s`;
    },

    getRoomDisplayText(roomName) {
        const config = this.getRoomConfig(roomName);
        const currentCount = Number(this.roomOccupancy[roomName] || 0);
        if (this.isDmRoom(roomName)) {
            return `DM: ${this.getDmPartnerName(roomName)}`;
        }
        if (this.isMainRoom(roomName)) {
            return `${roomName} (${currentCount})`;
        }
        if (config.maxUsers) {
            return `${roomName} ${currentCount}/${config.maxUsers}`;
        }
        return roomName;
    },

    setUsername(nextUsername, announce = true) {
        this.username = nextUsername;
        this.dmRoomColors = {};
        if (NameGenerator) {
            NameGenerator.currentUsername = nextUsername;
        }
        this.renderOwnIdentity();
        this.updateUserList(this.onlineUsers.length ? this.onlineUsers.map((user) => {
            if (user.id === this.userId || user.username === this.username) {
                return this.getSelfUser();
            }
            return user;
        }) : [this.getSelfUser()]);

        if (window.FirebaseChat && window.FirebaseChat.database) {
            window.FirebaseChat.updateProfile({
                username: this.username,
                mood: this.currentMood
            });
        }

        if (announce) {
            this.addSystemMessage(`You changed your name to ${this.username}!`);
        }
    },

    parseQuotedCommandValue(raw, commandName) {
        const prefix = `/${commandName}`;
        const remainder = String(raw || '').slice(prefix.length).trim();
        const quoted = remainder.match(/^"([\s\S]+)"$/);
        return quoted ? quoted[1].trim() : remainder;
    },

    normalizeHexColor(value) {
        const input = String(value || '').trim();
        if (!input) return null;
        const expanded = input.startsWith('#') ? input : `#${input}`;
        if (/^#[0-9a-fA-F]{6}$/.test(expanded)) return expanded.toUpperCase();
        if (/^#[0-9a-fA-F]{3}$/.test(expanded)) {
            return `#${expanded[1]}${expanded[1]}${expanded[2]}${expanded[2]}${expanded[3]}${expanded[3]}`.toUpperCase();
        }
        return null;
    },

    getRandomHexColor() {
        const colors = ['#FFD54F', '#FF8A65', '#81C784', '#4FC3F7', '#BA68C8', '#F48FB1', '#AED581'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    getDmRoomColor(roomName) {
        if (!roomName || !this.isDmRoom(roomName)) return '';
        if (!this.dmRoomColors[roomName]) {
            const partner = this.getDmPartnerName(roomName);
            const palette = ['rgba(255, 245, 184, 0.55)', 'rgba(224, 242, 254, 0.6)', 'rgba(232, 245, 233, 0.6)', 'rgba(252, 228, 236, 0.6)', 'rgba(243, 229, 245, 0.6)', 'rgba(255, 243, 224, 0.6)'];
            let hash = 0;
            for (let i = 0; i < partner.length; i += 1) {
                hash = ((hash << 5) - hash) + partner.charCodeAt(i);
                hash |= 0;
            }
            this.dmRoomColors[roomName] = palette[Math.abs(hash) % palette.length];
        }
        return this.dmRoomColors[roomName];
    },

    applyChatRoomTheme() {
        if (!this.chatMessages) return;
        if (this.activePane === 'dm' && this.lastDmRoom) {
            this.chatMessages.style.backgroundColor = this.getDmRoomColor(this.lastDmRoom);
            return;
        }
        this.chatMessages.style.backgroundColor = '';
    },

    makeMessagePreviewText(message) {
        const content = String(message && message.content ? message.content : '').trim();
        if (content) {
            return content.length > 42 ? `${content.slice(0, 42)}…` : content;
        }
        if (message && message.drawing) return '[drawing]';
        return '[message]';
    },

    setReplyTarget(message) {
        if (!message) return;
        this.currentReplyTarget = {
            messageId: message.messageId,
            username: message.username,
            content: message.content || '',
            drawing: message.drawing || null
        };
        if (this.replyPreview && this.replyPreviewText) {
            this.replyPreview.hidden = false;
            this.replyPreviewText.textContent = `${message.username}: ${this.makeMessagePreviewText(message)}`;
        }
    },

    clearReplyTarget() {
        this.currentReplyTarget = null;
        if (this.replyPreview) {
            this.replyPreview.hidden = true;
        }
        if (this.replyPreviewText) {
            this.replyPreviewText.textContent = '';
        }
    },

    getReplyReference(message) {
        const replyId = message && message.replyTo && message.replyTo.messageId;
        if (replyId && this.messageCache[replyId]) {
            return this.messageCache[replyId];
        }
        return message && message.replyTo ? message.replyTo : null;
    },

    getReactionGroups(reactions = {}) {
        const grouped = {};
        Object.entries(reactions || {}).forEach(([userId, reaction]) => {
            if (!reaction) return;
            if (!grouped[reaction]) grouped[reaction] = [];
            grouped[reaction].push(userId);
        });
        return grouped;
    },

    renderReactionSummary(message) {
        const grouped = this.getReactionGroups(message.reactions || {});
        const entries = Object.entries(grouped);
        if (!entries.length) return '';
        return `
            <div class="message-reactions-summary">
                ${entries.map(([reaction, userIds]) => `
                    <button class="reaction-pill ${userIds.includes(this.userId) ? 'active' : ''}" type="button" data-action="reactToMessage" data-message-id="${message.messageId}" data-reaction="${reaction}">
                        <span class="reaction-pill-emoji">${this.renderMoodEmoji(reaction)}</span>
                        <span class="reaction-pill-count">${userIds.length}</span>
                    </button>
                `).join('')}
            </div>
        `;
    },

    renderReactionPicker(message) {
        return `
            <div class="message-reaction-picker">
                ${this.reactionChoices.map((reaction) => `
                    <button class="reaction-choice" type="button" data-action="reactToMessage" data-message-id="${message.messageId}" data-reaction="${reaction}">
                        ${this.renderMoodEmoji(reaction)}
                    </button>
                `).join('')}
            </div>
        `;
    },

    async applyReaction(messageId, reaction) {
        const message = this.messageCache[messageId];
        if (!message) return;
        const nextReactions = { ...(message.reactions || {}) };
        if (nextReactions[this.userId] === reaction) {
            delete nextReactions[this.userId];
        } else {
            nextReactions[this.userId] = reaction;
        }

        if (window.FirebaseChat && window.FirebaseChat.database) {
            await window.FirebaseChat.updateMessageReactions(messageId, nextReactions);
            return;
        }

        this.addMessage({
            ...message,
            reactions: nextReactions
        });
    },

    applyMessageStyle(messageEl, message) {
        if (!messageEl) return;
        if (message.messageBgColor) {
            messageEl.style.background = message.messageBgColor;
        } else {
            messageEl.style.background = '';
        }
    },

    async syncWatchPresence(roomName, enabled) {
        if (this.watchPresenceRef) {
            try {
                await this.watchPresenceRef.remove();
            } catch (_) {}
            this.watchPresenceRef = null;
        }

        if (!enabled || !roomName || !(window.FirebaseChat && window.FirebaseChat.database)) {
            return;
        }

        try {
            const ref = window.FirebaseChat.database.ref(`watchers/${roomName}/${this.userId}`);
            await ref.set({
                username: this.username,
                room: roomName,
                online: true,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });
            ref.onDisconnect().remove();
            this.watchPresenceRef = ref;
        } catch (_) {}
    },

    async handleSecretCommand(rawCommand, options = {}) {
        const cmd = String(rawCommand || '').trim();
        if (!cmd.startsWith('/')) return false;

        const writeLine = typeof options.writeLine === 'function' ? options.writeLine : null;
        const write = (text, cls = 'lore') => {
            if (writeLine) {
                writeLine(text, cls);
            } else {
                this.addSystemMessage(text);
            }
        };

        if (cmd === '/watching' || cmd.startsWith('/watch ')) {
            const requestedRoom = cmd === '/watching'
                ? this.parseQuotedCommandValue(cmd, 'watching')
                : cmd.slice('/watch '.length).trim();
            if (!requestedRoom) {
                write('What room do you want to watch?', 'err');
                return true;
            }
            const knownRoomNames = [
                ...Object.keys(this.roomConfigs),
                ...this.dmRooms
            ];
            const resolvedWatchTarget = knownRoomNames.includes(requestedRoom) || this.isDmRoom(requestedRoom)
                ? requestedRoom
                : this.buildDmRoomName(requestedRoom);
            if (this.isDmRoom(resolvedWatchTarget)) {
                this.registerDmRoom(resolvedWatchTarget);
            }
            if (window.ShapeOS) {
                window.ShapeOS.internetUnblocked = true;
                window.ShapeOS.refreshApp('internet');
            }
            this.startWatching(resolvedWatchTarget);
            write(`passive intercept engaged for ${resolvedWatchTarget}.`, 'muted');
            return true;
        }

        if (cmd === '/infinitearchive') {
            const msg = 'Yo touch some grass if you found this shit dude';
            const bytes = new TextEncoder().encode(msg);
            const binary = Array.from(bytes).map((b) => b.toString(2).padStart(8, '0')).join(' ');
            write(binary, 'bin');
            return true;
        }

        if (cmd === '/myunc') {
            write('Unc is real 2007', 'lore');
            return true;
        }

        if (cmd === '/money') {
            write('I live in a picture...', 'lore');
            return true;
        }

        if (cmd === '/unc me') {
            this.setMood(':unc:');
            write('unc mode enabled.', 'lore');
            return true;
        }

        if (cmd.startsWith('/namehack')) {
            const remaining = this.getRemainingCooldown(this.nameHackCooldownMs, this.nameHackStorageKey, false);
            if (remaining > 0) {
                write(`namehack locked for ${this.formatCooldown(remaining)}.`, 'err');
                return true;
            }
            const hackedName = this.parseQuotedCommandValue(cmd, 'namehack');
            if (!hackedName) {
                write('namehack needs a quoted name.', 'err');
                return true;
            }
            this.setStorageNumber(this.nameHackStorageKey, Date.now(), false);
            this.setUsername(hackedName, false);
            write(`identity rewritten as ${hackedName}.`, 'lore');
            return true;
        }

        if (cmd.startsWith('/pimpmybg')) {
            const rawColor = cmd.slice('/pimpmybg'.length).trim();
            const nextColor = this.normalizeHexColor(rawColor) || this.getRandomHexColor();
            if (rawColor && !this.normalizeHexColor(rawColor)) {
                write('bad hex. using a random color instead.', 'muted');
            }
            this.messageBgColor = nextColor;
            this.renderOwnIdentity();
            write(`message background set to ${nextColor}.`, 'lore');
            return true;
        }

        return false;
    },

    updateRoomMenuOccupancy(roomCounts = null) {
        if (!this.roomMenu) return;

        if (roomCounts && typeof roomCounts === 'object') {
            this.roomOccupancy = roomCounts;
        }

        this.renderCurrentRoomLabel();

        this.roomMenu.querySelectorAll('[data-room]').forEach((btn) => {
            const roomName = btn.dataset.room;
            btn.textContent = this.getRoomDisplayText(roomName);
        });
    },

    isEmojiOnlyText(text) {
        const input = String(text || '').trim();
        if (!input) return false;
        const stripped = EmojiSystem.emojis.reduce((acc, emoji) => {
            const escaped = emoji.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return acc.replace(new RegExp(escaped, 'g'), ' ');
        }, input).replace(/\s+/g, '');
        return stripped.length === 0;
    },

    async selectRoom(roomName) {
        if (!roomName || roomName === this.currentRoom) {
            this.closeRoomMenu();
            return;
        }

        const previousRoom = this.currentRoom;
        this.closeMoodMenu();
        this.closeRoomMenu();
        this.chatMessages.innerHTML = '';
        this.messageElements = {};
        this.messageCache = {};
        this.clearReplyTarget();
        this.setCurrentRoom(roomName);
        this.addSystemMessage(`Switched to ${roomName}.`);

        if (window.FirebaseChat && window.FirebaseChat.database) {
            const result = await window.FirebaseChat.switchRoom(roomName);
            if (!result || result.ok === false) {
                this.setCurrentRoom(result && result.previousRoom ? result.previousRoom : previousRoom);
                this.chatMessages.innerHTML = '';
                this.addSystemMessage(result && result.reason ? result.reason : 'Could not join that room.');
                return;
            }
        } else {
            this.updateUserList([this.getSelfUser()]);
        }
        this.maybeScheduleAiReply();
    },

    isMobileViewport() {
        return window.matchMedia('(max-width: 900px)').matches;
    },

    shouldBlockNativeKeyboard() {
        return this.isMobileViewport() && !this.nativeKeyboardRequested;
    },

    syncInputAccessibility() {
        if (!this.messageInput) return;

        document.body.classList.toggle('native-keyboard-mode', this.isMobileViewport() && !this.shouldBlockNativeKeyboard());

        if (this.shouldBlockNativeKeyboard()) {
            this.messageInput.setAttribute('readonly', 'readonly');
            this.messageInput.setAttribute('inputmode', 'none');
        } else {
            this.messageInput.removeAttribute('readonly');
            this.messageInput.removeAttribute('inputmode');
        }
    },

    syncKeyboardVisibility() {
        if (!this.keyboardArea) return;
        const nativeInputActive = this.isMobileViewport() && this.nativeKeyboardRequested;
        const shouldHide = !this.keyboardVisible && !nativeInputActive;
        this.keyboardArea.classList.toggle('collapsed', shouldHide);
        this.keyboardArea.classList.toggle('native-input-active', nativeInputActive);
        if (this.keyboardToggleBtn) {
            this.keyboardToggleBtn.classList.toggle('active', this.keyboardVisible);
            const label = this.keyboardToggleBtn.querySelector('.preview-action-label');
            if (label) {
                label.textContent = this.keyboardToggleBtn ? (this.keyboardVisible ? 'Hide' : 'Keys') : 'Keys';
            }
        }
    },

    toggleKeyboardVisible(forceState) {
        this.keyboardVisible = typeof forceState === 'boolean' ? forceState : !this.keyboardVisible;
        this.syncKeyboardVisibility();
        if (!this.keyboardVisible && !this.nativeKeyboardRequested) {
            this.closeMoodMenu();
            this.closeRoomMenu();
            this.messageInput.blur();
        }
    },

    getEmojiModeKeys() {
        return Array.isArray(EmojiSystem.emojis) ? EmojiSystem.emojis.map((emoji) => emoji.code) : [];
    },

    getLetterDisplayValue(keyValue) {
        if (/^[a-z]$/i.test(keyValue)) {
            return (this.capsLock || this.shift) ? keyValue.toUpperCase() : keyValue.toLowerCase();
        }
        return keyValue === ' ' ? 'SPACE' : keyValue;
    },

    focusNativeKeyboard() {
        if (!this.messageInput) return;
        this.nativeKeyboardRequested = true;
        this.syncInputAccessibility();
        this.syncKeyboardVisibility();

        const openKeyboard = () => {
            try {
                this.messageInput.removeAttribute('readonly');
                this.messageInput.setAttribute('inputmode', 'text');
                this.messageInput.removeAttribute('disabled');
                this.messageInput.focus({ preventScroll: true });
                this.messageInput.click();
                this.messageInput.select();
                if (typeof this.messageInput.showPicker === 'function') {
                    try {
                        this.messageInput.showPicker();
                    } catch (_) {}
                }
                this.messageInput.setSelectionRange(this.messageInput.value.length, this.messageInput.value.length);
            } catch (_) {}
        };

        openKeyboard();
        this.toggleKeyboardVisible(false);
        window.requestAnimationFrame(openKeyboard);
        window.setTimeout(openKeyboard, 60);
        window.setTimeout(openKeyboard, 180);
    },

    updateKeyLabels() {
        document.querySelectorAll('.key').forEach((key) => {
            const keyValue = key.dataset.key;
            if (!key.dataset.defaultKey) {
                key.dataset.defaultKey = keyValue;
            }
            if (['Backspace', 'Enter', 'CapsLock', 'Shift', ' '].includes(keyValue)) {
                return;
            }
            key.textContent = this.getLetterDisplayValue(key.dataset.defaultKey);
        });
    },

    updateEmojiKeyboardState() {
        const emojiKeys = this.getEmojiModeKeys();
        const typeableKeys = Array.from(document.querySelectorAll('.key')).filter((key) => {
            const baseKey = key.dataset.defaultKey || key.dataset.key;
            return !['Backspace', 'Enter', 'CapsLock', 'Shift', ' '].includes(baseKey);
        });

        if (this.keyboardMode === 'emoji') {
            typeableKeys.forEach((key, index) => {
                const emojiCode = emojiKeys[index];
                key.dataset.key = emojiCode || '';
                key.innerHTML = emojiCode ? EmojiSystem.codeToImg(emojiCode) : '';
                key.classList.toggle('emoji-mode-key', Boolean(emojiCode));
                key.disabled = !emojiCode;
            });
            if (this.emojiToggleIcon) {
                this.emojiToggleIcon.textContent = 'ABC';
            }
        } else {
            typeableKeys.forEach((key) => {
                const defaultKey = key.dataset.defaultKey || key.dataset.key;
                key.dataset.key = defaultKey;
                key.classList.remove('emoji-mode-key');
                key.disabled = false;
            });
            this.updateKeyLabels();
            if (this.emojiToggleIcon) {
                this.emojiToggleIcon.textContent = '☺';
            }
        }
    },

    handleKeyPress(keyValue) {
        this.nativeKeyboardRequested = false;
        this.syncInputAccessibility();
        this.toggleKeyboardVisible(true);

        if (keyValue === 'Backspace') {
            this.messageInput.value = this.messageInput.value.slice(0, -1);
        } else if (keyValue === 'Enter') {
            this.sendMessage();
            return;
        } else if (keyValue === 'CapsLock') {
            this.capsLock = !this.capsLock;
            this.updateCapsDisplay();
            return;
        } else if (keyValue === 'Shift') {
            this.shift = !this.shift;
            this.updateShiftDisplay();
            return;
        } else if (keyValue === ' ') {
            this.messageInput.value += ' ';
        } else {
            let char = keyValue;
            if (this.keyboardMode !== 'emoji' && (this.capsLock || this.shift)) {
                char = char.toUpperCase();
            }
            this.messageInput.value += char;
            
            if (this.shift) {
                this.shift = false;
                this.updateShiftDisplay();
            }
        }
        
        this.updatePreview();

        if (this.shouldBlockNativeKeyboard()) {
            this.messageInput.blur();
        } else {
            this.messageInput.focus();
        }

        this.playKeySound(keyValue);
    },

    getAudioCtx() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioCtx;
    },

    playTone(freq = 320, duration = 0.035, gainValue = 0.025, wave = 'square', detune = 0) {
        if (!this.appAudioEnabled) return;
        const ctx = this.getAudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(gainValue, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
    },

    playKeySound(key) {
        const keyStr = String(key || '');
        const code = keyStr.charCodeAt(0) || 70;
        this.playTone(170 + (code % 44) * 7, 0.02, 0.017, 'triangle', (code % 7) * 6);
    },

    setupKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach((key) => {
            if (!key.dataset.defaultKey) {
                key.dataset.defaultKey = key.dataset.key;
            }

            key.addEventListener('click', () => {
                const keyValue = key.dataset.key;
                if (!keyValue || key.disabled) return;
                this.handleKeyPress(keyValue);
            });

            key.addEventListener('mousedown', () => {
                key.classList.add('pressed');
            });
            key.addEventListener('mouseup', () => {
                key.classList.remove('pressed');
            });
            key.addEventListener('mouseleave', () => {
                key.classList.remove('pressed');
            });
        });
    },

    setupCanvas() {
        this.canvas = document.getElementById('drawCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas();

        this.canvas.addEventListener('mousedown', (event) => this.startDrawing(event));
        this.canvas.addEventListener('mousemove', (event) => this.draw(event));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.startDrawing(event.touches[0]);
        }, { passive: false });
        this.canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            this.draw(event.touches[0]);
        }, { passive: false });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());

        const toolButtons = document.querySelectorAll('.draw-tool-btn');
        toolButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                toolButtons.forEach((n) => n.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
            });
        });

        const color = document.getElementById('drawColor');
        if (color) {
            color.addEventListener('input', () => {
                this.currentColor = color.value;
            });
        }

        const size = document.getElementById('drawSize');
        if (size) {
            size.addEventListener('change', () => {
                this.currentSize = Number(size.value) || 4;
            });
        }

        const clear = document.getElementById('drawClear');
        if (clear) {
            clear.addEventListener('click', () => this.clearCanvas());
        }

        const send = document.getElementById('drawSend');
        if (send) {
            send.addEventListener('click', () => this.sendMessage());
        }
    },

    getCanvasCoords(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (event.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    },

    startDrawing(event) {
        if (!this.canvas) return;
        const coords = this.getCanvasCoords(event);
        this.lastX = coords.x;
        this.lastY = coords.y;
        this.isDrawing = true;
    },

    draw(event) {
        if (!this.isDrawing || !this.ctx) return;
        const coords = this.getCanvasCoords(event);
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;
        this.ctx.lineWidth = this.currentTool === 'eraser' ? this.currentSize * 3 : this.currentSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        this.lastX = coords.x;
        this.lastY = coords.y;
        this.hasDrawn = true;
    },

    stopDrawing() {
        this.isDrawing = false;
    },

    clearCanvas() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasDrawn = false;
    },

    hasDrawing() {
        return this.hasDrawn;
    },

    getDrawingData() {
        if (!this.canvas) return null;
        return this.hasDrawing() ? this.canvas.toDataURL('image/png') : null;
    },

    highlightKey(key, isPressed) {
        // Find the corresponding on-screen key
        let keyElement = document.querySelector(`.key[data-key="${key}"]`);
        
        // Handle case sensitivity
        if (!keyElement) {
            keyElement = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
        }
        
        if (keyElement) {
            if (isPressed) {
                keyElement.classList.add('pressed');
            } else {
                keyElement.classList.remove('pressed');
            }
        }
    },

    updateCapsDisplay() {
        const capsKey = document.querySelector('.key-caps');
        if (capsKey) {
            capsKey.classList.toggle('active', this.capsLock);
        }
        if (this.keyboardMode === 'letters') {
            this.updateKeyLabels();
        }
    },

    updateShiftDisplay() {
        const shiftKey = document.querySelector('.key-shift');
        if (shiftKey) {
            shiftKey.classList.toggle('active', this.shift);
        }
        if (this.keyboardMode === 'letters') {
            this.updateKeyLabels();
        }
    },

    updatePreview() {
        if (this.previewText) {
            this.previewText.textContent = this.messageInput.value;
        }
    },

    connectWS() {
        try {
            const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
            const ws = new WebSocket(`${protocol}//${location.host}`);
            ws.addEventListener('open', () => { this.ws = ws; });
            ws.addEventListener('message', (e) => {
                try { this.handleWSMessage(JSON.parse(e.data)); } catch (_) {}
            });
            ws.addEventListener('close', () => { this.ws = null; });
            ws.addEventListener('error', () => { this.ws = null; });
        } catch (_) {}
    },

    handleWSMessage(data) {
        if (!data || !data.type) return;
        if (data.type === 'welcome' || data.type === 'roomSnapshot') {
            if (data.user) {
                this.serverId = data.user.id;
                this.userId = data.user.id || this.userId;
                this.username = data.user.username || this.username;
                this.currentMood = data.user.mood || this.currentMood;
                this.renderOwnIdentity();
            }
            if (data.room) {
                this.setCurrentRoom(data.room);
            }
            if (Array.isArray(data.onlineUsers)) {
                this.updateUserList(data.onlineUsers);
            }
        } else if (data.type === 'newMessage' && data.message) {
            if (!this.watching) {
                this.addMessage(data.message);
            }
        } else if (data.type === 'watchStart') {
            this.showEavesdropPanel(data.room, data.onlineUsers || [], data.messages || []);
        } else if (data.type === 'watchMessage' && data.message) {
            this.addEavesdropMessage(data.message);
        } else if (data.type === 'stolenIdeas') {
            this.onIdeasStolen(data);
        } else if (data.type === 'watcherInfo') {
            if (window.ShapeOS && typeof window.ShapeOS._pendingWatcherCallback === 'function') {
                window.ShapeOS._pendingWatcherCallback(data.watchers || []);
                window.ShapeOS._pendingWatcherCallback = null;
            }
        }
    },

    startWatching() {
        let roomName = arguments.length > 0 && arguments[0] ? arguments[0] : this.currentRoom;
        if (!roomName) roomName = this.currentRoom;
        if (this.watching) {
            this.stopWatching();
        }

        if (window.FirebaseChat && window.FirebaseChat.database) {
            const database = window.FirebaseChat.database;
            const roomRef = database.ref(`rooms/${roomName}`);
            const usersRef = roomRef.child('users');
            const messagesRef = roomRef.child('messages');

            this.watchRoom = roomName;
            this.watchUsersRef = usersRef;
            this.watchMessagesRef = messagesRef;
            this.watchSeenMessageKeys = new Set();

            Promise.all([
                usersRef.once('value'),
                messagesRef.limitToLast(100).once('value')
            ]).then(([usersSnap, messagesSnap]) => {
                const users = [];
                usersSnap.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    if (user && user.online) {
                        users.push({
                            id: childSnapshot.key,
                            username: user.username,
                            mood: user.mood || ':happy:'
                        });
                    }
                });

                const history = [];
                messagesSnap.forEach((childSnapshot) => {
                    this.watchSeenMessageKeys.add(childSnapshot.key);
                    const msg = childSnapshot.val() || {};
                    history.push({
                        userId: msg.userId,
                        username: msg.username,
                        content: msg.content,
                        drawing: msg.drawing || null,
                        timestamp: msg.timestamp || Date.now()
                    });
                });

                this.showEavesdropPanel(roomName, users, history);
            }).catch(() => {
                this.addSystemMessage(`Unable to watch ${roomName}.`);
            });

            this.watchUserListener = usersRef.on('value', (snapshot) => {
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    if (user && user.online) {
                        users.push({
                            id: childSnapshot.key,
                            username: user.username,
                            mood: user.mood || ':happy:'
                        });
                    }
                });

                if (this.watching && this.watchRoom === roomName) {
                    const targetsEl = document.getElementById('eavesdropTargets');
                    if (targetsEl) {
                        targetsEl.innerHTML = users
                            .map((user) => `<span class="eavesdrop-target">${this.escapeHtml(user.username)}</span>`)
                            .join('<span class="target-sep">&#8703;</span>');
                    }
                }
            });

            this.watchMessageListener = messagesRef.limitToLast(100).on('child_added', (snapshot) => {
                if (!this.watching || this.watchRoom !== roomName) return;
                if (this.watchSeenMessageKeys && this.watchSeenMessageKeys.has(snapshot.key)) return;
                if (this.watchSeenMessageKeys) {
                    this.watchSeenMessageKeys.add(snapshot.key);
                }
                const msg = snapshot.val() || {};
                this.addEavesdropMessage({
                    userId: msg.userId,
                    username: msg.username,
                    content: msg.content,
                    drawing: msg.drawing || null,
                    timestamp: msg.timestamp || Date.now()
                });
            });
        } else if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'watch', room: roomName }));
        } else {
            this.startWatchDemo();
        }
    },

    startWatchDemo() {
        const conv = this.demoConversations[
            Math.floor(Math.random() * this.demoConversations.length)
        ];
        const userObjs = conv.users.map((u) => ({ username: u }));
        this.showEavesdropPanel(conv.room, userObjs, []);
        conv.messages.forEach((msg) => {
            const t = setTimeout(() => {
                if (!this.watching) return;
                this.addEavesdropMessage({
                    username: msg.sender,
                    content: msg.text,
                    timestamp: new Date().toISOString()
                });
            }, msg.delay);
            this.demoWatchTimers.push(t);
        });
    },

    showEavesdropPanel(room, users, history) {
        this.watching = true;
        this.watchRoom = room;
        this._watchHistory = Array.isArray(history) ? [...history] : [];
        this.syncWatchPresence(room, true);

        const panel = document.getElementById('eavesdropPanel');
        const roomLabel = document.getElementById('eavesdropRoomName');
        const targetsEl = document.getElementById('eavesdropTargets');
        const feed = document.getElementById('eavesdropFeed');
        if (!panel) return;

        roomLabel.textContent = room;
        const names = users.map((u) => (typeof u === 'string' ? u : u.username));
        targetsEl.innerHTML = names
            .map((n) => `<span class="eavesdrop-target">${this.escapeHtml(n)}</span>`)
            .join('<span class="target-sep">&#8703;</span>');

        feed.innerHTML = '';
        this._watchHistory.forEach((m) => this.addEavesdropMessage(m, false));
        panel.removeAttribute('hidden');
        feed.scrollTop = feed.scrollHeight;
    },

    addEavesdropMessage(msg, scroll = true) {
        if (!this.watching) return;
        const feed = document.getElementById('eavesdropFeed');
        if (!feed) return;
        const div = document.createElement('div');
        div.className = 'eavesdrop-msg';
        const t = new Date(msg.timestamp || Date.now())
            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        div.innerHTML = `<span class="emsg-time">[${t}]</span> <span class="emsg-user">${this.escapeHtml(msg.username || '???')}</span><span class="emsg-sep">:</span> <span class="emsg-text">${this.escapeHtml(msg.content || '')}</span>`;
        feed.appendChild(div);
        if (scroll) feed.scrollTop = feed.scrollHeight;
        if (scroll) {
            if (!this._watchHistory) this._watchHistory = [];
            this._watchHistory.push(msg);
        }
    },

    stopWatching() {
        this.watching = false;
        if (this.watchRoom) {
            this.syncWatchPresence(this.watchRoom, false);
        }
        this.watchRoom = null;
        this._watchHistory = null;
        this.watchSeenMessageKeys = null;
        this.demoWatchTimers.forEach((t) => clearTimeout(t));
        this.demoWatchTimers = [];
        if (this.watchUsersRef && this.watchUserListener) {
            this.watchUsersRef.off('value', this.watchUserListener);
        }
        if (this.watchMessagesRef && this.watchMessageListener) {
            this.watchMessagesRef.off('child_added', this.watchMessageListener);
        }
        this.watchUsersRef = null;
        this.watchMessagesRef = null;
        this.watchUserListener = null;
        this.watchMessageListener = null;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'stopWatch' }));
        }
        const panel = document.getElementById('eavesdropPanel');
        if (panel) panel.setAttribute('hidden', '');
    },

    doStealIdeas() {
        const room = this.watchRoom;
        const history = this._watchHistory || [];
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'stealIdeas' }));
        } else {
            this.onIdeasStolen({
                room,
                messages: history,
                onlineUsers: [],
                timestamp: new Date().toISOString()
            });
        }
    },

    onIdeasStolen(data) {
        this.stopWatching();
        if (window.ShapeOS) {
            window.ShapeOS.internetUnblocked = true;
            if (!window.ShapeOS.stolenIdeasLog) window.ShapeOS.stolenIdeasLog = [];
            window.ShapeOS.stolenIdeasLog.push({
                room: data.room || '???',
                timestamp: data.timestamp || new Date().toISOString(),
                messages: data.messages || [],
                users: data.onlineUsers || []
            });
            window.ShapeOS._openBrowserTo = 'ideaarchive.local';
            window.ShapeOS.refreshApp('internet');
        }
        this.addSystemMessage('ideas stolen. internet unblocked.');
    },

    getSelfUser() {
        return {
            id: this.userId,
            username: this.username,
            mood: this.currentMood
        };
    },

    renderMoodEmoji(mood) {
        return EmojiSystem && typeof EmojiSystem.codeToImg === 'function'
            ? EmojiSystem.codeToImg(mood || ':happy:')
            : this.escapeHtml(mood || '');
    },

    renderOwnIdentity() {
        if (!this.yourName) return;
        this.yourName.innerHTML = `${this.escapeHtml(this.username)} ${this.renderMoodEmoji(this.currentMood)}`;
        this.yourName.style.background = this.messageBgColor || '';
        if (this.moodSelect) {
            this.moodSelect.value = this.currentMood;
        }
        this.updateMoodOptionSelection();
    },

    setMood(mood) {
        this.currentMood = mood || ':happy:';
        this.renderOwnIdentity();
        this.updateUserList(this.onlineUsers.length ? this.onlineUsers : [this.getSelfUser()]);
        if (window.FirebaseChat && window.FirebaseChat.database) {
            window.FirebaseChat.updateProfile({
                username: this.username,
                mood: this.currentMood
            });
        }
    },

    renderCurrentRoomLabel() {
        if (!this.roomName) return;
        const mainRoomLabel = this.getRoomDisplayText(this.lastMainRoom || 'Lobby');
        this.roomName.textContent = mainRoomLabel;
        this.roomName.classList.toggle('active', this.activePane === 'room');
        this.roomName.classList.toggle('unread', this.mainRoomUnread && this.activePane !== 'room');
        if (this.dmName) {
            const unreadCount = Object.keys(this.dmUnreadRooms).length;
            this.dmName.textContent = unreadCount > 0 ? `DMs (${unreadCount})` : 'DMs';
            this.dmName.classList.toggle('active', this.activePane === 'dm');
            this.dmName.classList.toggle('unread', Object.keys(this.dmUnreadRooms).length > 0 && this.activePane !== 'dm');
        }
        this.renderChatContext();
        this.renderSidebarList();
        this.applyChatRoomTheme();
    },

    renderChatContext() {
        if (!this.chatContextBar || !this.chatContextName) return;
        this.chatContextBar.hidden = true;
        this.chatContextName.textContent = 'DM';
    },

    renderSidebarList() {
        if (!this.userList) return;
        this.userList.innerHTML = '';

        if (this.userListHeader) {
            this.userListHeader.textContent = this.activePane === 'dm' ? 'DMs' : 'Users';
        }

        if (this.activePane === 'dm') {
            const newDmLi = document.createElement('li');
            newDmLi.className = 'clickable dm-sidebar-new';
            newDmLi.textContent = 'Text a Stranger';
            newDmLi.title = 'Start a new DM';
            newDmLi.addEventListener('click', async () => {
                await this.startNewDmFromLobbySpeaker();
            });
            this.userList.appendChild(newDmLi);

            if (!this.dmRooms.length) {
                const empty = document.createElement('li');
                empty.className = 'dm-sidebar-empty';
                empty.textContent = 'No DMs yet';
                this.userList.appendChild(empty);
                return;
            }

            this.dmRooms.forEach((roomName) => {
                const li = document.createElement('li');
                li.className = 'clickable dm-sidebar-row';
                if (roomName === this.lastDmRoom) {
                    li.classList.add('dm-sidebar-active');
                }
                if (this.dmUnreadRooms[roomName]) {
                    li.classList.add('dm-sidebar-unread');
                }
                li.title = `Open DM with ${this.getDmPartnerName(roomName)}`;
                li.addEventListener('click', async () => {
                    await this.selectRoom(roomName);
                });

                const marker = document.createElement('span');
                marker.className = 'dm-sidebar-marker';
                marker.textContent = this.dmUnreadRooms[roomName] ? '•' : '';

                const name = document.createElement('span');
                name.className = 'dm-sidebar-name';
                name.textContent = this.getDmPartnerName(roomName);

                const del = document.createElement('button');
                del.className = 'dm-sidebar-delete';
                del.type = 'button';
                del.title = `Delete DM with ${this.getDmPartnerName(roomName)}`;
                del.textContent = '×';
                del.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await this.closeDmRoom(roomName);
                });

                li.appendChild(marker);
                li.appendChild(name);
                li.appendChild(del);
                this.userList.appendChild(li);
            });
            return;
        }

        const visibleUsers = (!this.hasOtherHumanUsers() && this.isMainRoom()) ? [...this.onlineUsers, this.aiUser] : this.onlineUsers;
        visibleUsers.forEach((user) => {
            const li = document.createElement('li');
            const isSelf = user.id === this.userId || user.username === this.username;
            li.className = isSelf ? 'you' : '';
            li.innerHTML = `${this.escapeHtml(user.username)} ${this.renderMoodEmoji(user.mood)}`;
            if (!isSelf) {
                li.classList.add('clickable');
                li.title = `Direct message ${user.username}`;
                li.addEventListener('click', () => {
                    this.openDirectMessage(user);
                });
            }
            this.userList.appendChild(li);
        });
    },

    setCurrentRoom(roomName) {
        this.currentRoom = roomName || 'Lobby';
        if (this.isDmRoom(this.currentRoom)) {
            this.activePane = 'dm';
            this.registerDmRoom(this.currentRoom);
            this.lastDmRoom = this.currentRoom;
        } else {
            this.activePane = 'room';
            this.lastMainRoom = this.currentRoom;
        }
        this.clearRoomUnread(this.currentRoom);
        this.ensureInactiveRoomListeners();
        this.renderCurrentRoomLabel();
    },

    promptForRoom() {
        this.toggleRoomMenu();
    },

    normalizeUser(user) {
        if (typeof user === 'string') {
            return {
                id: user,
                username: user,
                mood: ':happy:'
            };
        }

        return {
            id: user && user.id ? user.id : user && user.userId ? user.userId : user && user.username ? user.username : 'unknown',
            username: user && user.username ? user.username : 'Unknown',
            mood: user && user.mood ? user.mood : ':happy:'
        };
    },

    hasOtherHumanUsers() {
        return this.onlineUsers.some((user) => user.id !== this.userId);
    },

    updatePresenceDisplay(users) {
        const normalizedUsers = (Array.isArray(users) && users.length ? users : [this.getSelfUser()])
            .map((user) => {
                const normalizedUser = this.normalizeUser(user);
                if (normalizedUser.id === this.userId) {
                    return this.getSelfUser();
                }
                return normalizedUser;
            });

        const deduped = [];
        const seen = new Set();
        normalizedUsers.forEach((user) => {
            if (!seen.has(user.id)) {
                seen.add(user.id);
                deduped.push(user);
            }
        });

        deduped.sort((a, b) => {
            if (a.id === this.userId) return -1;
            if (b.id === this.userId) return 1;
            return a.username.localeCompare(b.username);
        });

        this.onlineUsers = deduped;
        if (this.isMainRoom()) {
            this.lastMainRoomUsers = deduped.slice();
        }
        this.roomOccupancy[this.currentRoom] = deduped.length;
        this.updateRoomMenuOccupancy();
        if (this.hasOtherHumanUsers()) {
            window.clearTimeout(this.aiReplyTimer);
        }
        this.renderSidebarList();

        document.getElementById('userCount').textContent = String(deduped.length);
    },

    maybeScheduleAiReply() {
        if (!this.isMainRoom()) {
            window.clearTimeout(this.aiReplyTimer);
            return;
        }

        if (this.hasOtherHumanUsers()) {
            return;
        }

        window.clearTimeout(this.aiReplyTimer);
        this.aiReplyTimer = window.setTimeout(() => {
            const response = this.aiResponses[Math.floor(Math.random() * this.aiResponses.length)];
            this.addMessage({
                userId: this.aiUser.id,
                username: this.aiUser.username,
                mood: this.aiUser.mood,
                content: response,
                timestamp: Date.now()
            });
        }, 900 + Math.floor(Math.random() * 1200));
    },

    async sendMessage() {
        const text = this.messageInput.value.trim();
        const drawing = this.getDrawingData();
        if (!text && !drawing) return;

        if (text.startsWith('/')) {
            const handled = await this.handleSecretCommand(text);
            if (handled) {
                this.messageInput.value = '';
                this.updatePreview();
                this.clearCanvas();
                return;
            }
        }

        const roomConfig = this.getRoomConfig(this.currentRoom);
        if (roomConfig.mode === 'emoji_draw_only' && text && !this.isEmojiOnlyText(text)) {
            this.addSystemMessage('This room only allows Shape emojis and drawings.');
            return;
        }

        if (this.isDmRoom(this.currentRoom)) {
            this.registerDmRoom(this.currentRoom);
        }

        let sent = false;
        const replyTo = this.currentReplyTarget ? { ...this.currentReplyTarget } : null;
        if (window.FirebaseChat && window.FirebaseChat.database) {
            sent = await window.FirebaseChat.sendMessage(text, drawing, roomConfig, {
                replyTo,
                messageBgColor: this.messageBgColor
            });
        } else if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'message',
                content: text,
                drawing: drawing || null,
                replyTo,
                messageBgColor: this.messageBgColor
            }));
            sent = true;
        }

        if (!sent) {
            this.addSystemMessage('Message could not be sent in this room right now.');
            return;
        }

        if (!window.FirebaseChat || !window.FirebaseChat.database) {
            this.addMessage({
                messageId: `local_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                userId: this.userId,
                username: this.username,
                mood: this.currentMood,
                content: text,
                drawing: drawing,
                timestamp: Date.now(),
                replyTo,
                reactions: {},
                messageBgColor: this.messageBgColor
            });
        }

        this.messageInput.value = '';
        this.updatePreview();
        this.clearCanvas();
        this.emojiPicker.classList.remove('active');
        this.clearReplyTarget();
        this.maybeScheduleAiReply();
    },

    addMessage(sender, text, isOwn = false, drawing = null) {
        const message = typeof sender === 'object' && sender !== null
            ? {
                messageId: sender.messageId || sender.id || `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                userId: sender.userId || sender.id || null,
                username: sender.username || 'Unknown',
                mood: sender.mood || ':happy:',
                content: sender.content || '',
                drawing: sender.drawing || null,
                timestamp: sender.timestamp || Date.now(),
                replyTo: sender.replyTo || null,
                reactions: sender.reactions || {},
                messageBgColor: sender.messageBgColor || null
            }
            : {
                messageId: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                userId: isOwn ? this.userId : null,
                username: sender || 'Unknown',
                mood: isOwn ? this.currentMood : ':happy:',
                content: text || '',
                drawing: drawing || null,
                timestamp: Date.now(),
                replyTo: null,
                reactions: {},
                messageBgColor: this.messageBgColor
            };

        const ownMessage = message.userId
            ? message.userId === this.userId
            : message.username === this.username;
        if (this.currentRoom === 'Lobby' && !ownMessage) {
            this.lastLobbySpeaker = {
                id: message.userId || message.username,
                username: message.username,
                mood: message.mood || ':happy:'
            };
        }
        const existing = this.messageElements[message.messageId];
        const messageDiv = existing || document.createElement('div');
        messageDiv.className = `message ${ownMessage ? 'own' : 'other'}`;
        messageDiv.classList.add(this.getMoodClassName(message.mood));
        messageDiv.dataset.messageId = message.messageId;
        
        const time = new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const parsedText = EmojiSystem.parseEmojis(this.escapeHtml(message.content || ''));
        const replyRef = this.getReplyReference(message);
        const replyHtml = replyRef ? `
            <button class="message-reply-ref" type="button" data-action="replyMessage" data-message-id="${replyRef.messageId || message.messageId}">
                <span class="message-reply-user">${this.escapeHtml(replyRef.username || 'Unknown')}</span>
                <span class="message-reply-text">${this.escapeHtml(this.makeMessagePreviewText(replyRef))}</span>
            </button>
        ` : '';
        const drawingHtml = message.drawing ? `<div class="message-drawing"><img src="${message.drawing}" alt="Drawing"></div>` : '';
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${this.escapeHtml(message.username)} ${this.renderMoodEmoji(message.mood)}</span>
                <span class="message-time">${time}</span>
            </div>
            ${replyHtml}
            ${message.content ? `<div class="message-content">${parsedText}</div>` : ''}
            ${drawingHtml}
            ${this.renderReactionSummary(message)}
            <div class="message-actions-row">
                <button class="message-action-btn" type="button" data-action="replyMessage" data-message-id="${message.messageId}">Reply</button>
                <button class="message-action-btn" type="button" data-action="toggleReactionPicker" data-message-id="${message.messageId}">React</button>
            </div>
            ${this.renderReactionPicker(message)}
        `;

        this.applyMessageStyle(messageDiv, message);
        this.messageCache[message.messageId] = message;
        
        if (!existing) {
            this.messageElements[message.messageId] = messageDiv;
            this.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();
        }
    },

    addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.innerHTML = `<span class="system-icon">★</span> ${this.escapeHtml(text)}`;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    },

    insertEmoji(code) {
        this.messageInput.value += code;
        this.updatePreview();
    },

    regenerateName() {
        this.closeMoodMenu();
        const remaining = this.getRemainingCooldown(this.renameCooldownMs, this.renameCooldownStorageKey, true);
        if (remaining > 0) {
            this.addSystemMessage(`Name change cooldown: ${this.formatCooldown(remaining)} remaining.`);
            return;
        }
        this.setStorageNumber(this.renameCooldownStorageKey, Date.now(), true);
        this.setUsername(NameGenerator.regenerateUsername(), true);
    },

    updateUserList(users) {
        this.updatePresenceDisplay(users);
    },

    addSimulatedUsers() {
        this.updateUserList([this.getSelfUser()]);
    },

    simulateResponse(originalMessage) {
        this.maybeScheduleAiReply();
    },

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Chat.init();
});

window.ShapeChat = Chat;
