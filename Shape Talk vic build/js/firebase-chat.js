// Firebase Real-time Chat Integration for ShapeTalk
const FirebaseChat = {
    database: null,
    roomRef: null,
    usersRef: null,
    messagesRef: null,
    currentRoom: 'Lobby',
    userId: null,
    username: null,
    mood: ':happy:',
    lastMessageKey: null,
    messageListeners: [],

    init(profile) {
        const userProfile = profile || {};
        this.username = userProfile.username || null;
        this.mood = userProfile.mood || ':happy:';
        this.userId = userProfile.userId || this.generateUserId();

        if (typeof firebase === 'undefined') {
            console.warn('Firebase not loaded, using demo mode');
            return false;
        }

        try {
            if (window.FirebaseConfig && !window.FirebaseConfig.init()) {
                return false;
            }

            this.database = window.FirebaseConfig && window.FirebaseConfig.getDatabase
                ? window.FirebaseConfig.getDatabase()
                : firebase.database();

            if (!this.database) {
                return false;
            }

            this.setupRoom(this.currentRoom);
            this.joinRoom();
            return true;
        } catch (error) {
            console.error('Firebase chat init error:', error);
            return false;
        }
    },

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    },

    getRoomConfig(roomName) {
        if (window.ShapeChat && typeof window.ShapeChat.getRoomConfig === 'function') {
            return window.ShapeChat.getRoomConfig(roomName);
        }

        return { maxUsers: null, mode: 'open', maxMessages: null, ephemeral: false };
    },

    setupRoom(roomName) {
        this.currentRoom = roomName;
        this.roomRef = this.database.ref(`rooms/${roomName}`);
        this.usersRef = this.roomRef.child('users');
        this.messagesRef = this.roomRef.child('messages');
    },

    async canJoinRoom(roomName) {
        const roomRef = this.database.ref(`rooms/${roomName}`);
        const usersRef = roomRef.child('users');
        const roomConfig = this.getRoomConfig(roomName);
        if (!roomConfig.maxUsers) {
            return { ok: true };
        }

        const snapshot = await usersRef.once('value');
        let onlineCount = 0;
        let alreadyPresent = false;
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (childSnapshot.key === this.userId && user && user.online) {
                alreadyPresent = true;
            }
            if (user && user.online) {
                onlineCount += 1;
            }
        });

        if (!alreadyPresent && onlineCount >= roomConfig.maxUsers) {
            return {
                ok: false,
                reason: `${roomName} is full right now.`
            };
        }

        return { ok: true };
    },

    async getRoomOccupancyCounts() {
        if (!this.database) return {};
        const snapshot = await this.database.ref('rooms').once('value');
        const counts = {};

        snapshot.forEach((roomSnapshot) => {
            const roomName = roomSnapshot.key;
            let count = 0;
            roomSnapshot.child('users').forEach((userSnapshot) => {
                const user = userSnapshot.val();
                if (user && user.online) {
                    count += 1;
                }
            });
            counts[roomName] = count;
        });

        return counts;
    },

    async syncRoomOccupancyCounts() {
        if (!window.ShapeChat || typeof window.ShapeChat.updateRoomMenuOccupancy !== 'function') {
            return;
        }
        const counts = await this.getRoomOccupancyCounts();
        window.ShapeChat.updateRoomMenuOccupancy(counts);
    },

    listenForRoomList(onRooms) {
        if (!this.database || typeof onRooms !== 'function') return () => {};
        const roomsRef = this.database.ref('rooms');
        const handler = (snapshot) => {
            const roomNames = [];
            snapshot.forEach((roomSnapshot) => {
                roomNames.push(roomSnapshot.key);
            });
            onRooms(roomNames);
        };
        roomsRef.on('value', handler);
        return () => roomsRef.off('value', handler);
    },

    async joinRoom() {
        const canJoin = await this.canJoinRoom(this.currentRoom);
        if (!canJoin.ok) {
            return canJoin;
        }

        const userRef = this.usersRef.child(this.userId);
        
        await userRef.set({
            username: this.username,
            mood: this.mood,
            joinedAt: firebase.database.ServerValue.TIMESTAMP,
            online: true
        });

        userRef.onDisconnect().update({ online: false });

        if (window.ShapeChat && window.ShapeChat.setCurrentRoom) {
            window.ShapeChat.setCurrentRoom(this.currentRoom);
        }

        this.listenForUsers();
        this.listenForMessages();
        await this.syncRoomOccupancyCounts();
        return { ok: true };
    },

    listenForUsers() {
        this.usersRef.on('value', async (snapshot) => {
            const users = [];
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if (user.online) {
                    users.push({
                        id: childSnapshot.key,
                        username: user.username,
                        mood: user.mood || ':happy:'
                    });
                }
            });
            
            if (window.ShapeChat && window.ShapeChat.updateUserList) {
                window.ShapeChat.updateUserList(users);
            }
            
            if (window.ShapeChat && document.getElementById('userCount')) {
                document.getElementById('userCount').textContent = users.length;
            }

            await this.syncRoomOccupancyCounts();
        });
    },

    listenForMessages() {
        this.messagesRef.limitToLast(50).on('child_added', (snapshot) => {
            if (snapshot.key === this.lastMessageKey) {
                this.lastMessageKey = null;
            }

            const message = snapshot.val();
            
            if (window.ShapeChat && window.ShapeChat.addMessage) {
                window.ShapeChat.addMessage({
                    messageId: snapshot.key,
                    userId: message.userId,
                    username: message.username,
                    mood: message.mood || ':happy:',
                    content: message.content || '',
                    drawing: message.drawing || null,
                    timestamp: message.timestamp || Date.now(),
                    replyTo: message.replyTo || null,
                    reactions: message.reactions || {},
                    messageBgColor: message.messageBgColor || null
                });
            }
        });

        this.messagesRef.limitToLast(50).on('child_changed', (snapshot) => {
            const message = snapshot.val();
            if (window.ShapeChat && window.ShapeChat.addMessage) {
                window.ShapeChat.addMessage({
                    messageId: snapshot.key,
                    userId: message.userId,
                    username: message.username,
                    mood: message.mood || ':happy:',
                    content: message.content || '',
                    drawing: message.drawing || null,
                    timestamp: message.timestamp || Date.now(),
                    replyTo: message.replyTo || null,
                    reactions: message.reactions || {},
                    messageBgColor: message.messageBgColor || null
                });
            }
        });
    },

    async trimMessages(roomName, maxMessages) {
        if (!maxMessages) return;
        const messagesRef = this.database.ref(`rooms/${roomName}/messages`);
        const snapshot = await messagesRef.orderByChild('timestamp').once('value');
        const keys = [];
        snapshot.forEach((childSnapshot) => {
            keys.push(childSnapshot.key);
        });

        const overflow = keys.length - maxMessages;
        if (overflow <= 0) return;

        const updates = {};
        keys.slice(0, overflow).forEach((key) => {
            updates[key] = null;
        });
        await messagesRef.update(updates);
    },

    async sendMessage(content, drawing = null, roomConfig = null, extras = {}) {
        if (!this.messagesRef) {
            console.warn('Not connected to Firebase, message not sent');
            return false;
        }

        const activeRoomConfig = roomConfig || this.getRoomConfig(this.currentRoom);

        const messageData = {
            userId: this.userId,
            username: this.username,
            mood: this.mood,
            content: content,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        if (drawing) {
            messageData.drawing = drawing;
        }

        if (extras.replyTo) {
            messageData.replyTo = extras.replyTo;
        }

        if (extras.messageBgColor) {
            messageData.messageBgColor = extras.messageBgColor;
        }

        messageData.reactions = extras.reactions || {};

        const newMessageRef = this.messagesRef.push();
        this.lastMessageKey = newMessageRef.key;
        await newMessageRef.set(messageData);
        await this.trimMessages(this.currentRoom, activeRoomConfig.maxMessages);
        return true;
    },

    async updateMessageReactions(messageId, reactions) {
        if (!this.messagesRef || !messageId) return false;
        await this.messagesRef.child(messageId).child('reactions').set(reactions || {});
        return true;
    },

    updateProfile(profile = {}) {
        if (profile.username) {
            this.username = profile.username;
        }

        if (profile.mood) {
            this.mood = profile.mood;
        }

        if (this.usersRef && this.userId) {
            this.usersRef.child(this.userId).update({
                username: this.username,
                mood: this.mood,
                online: true
            });
        }
    },

    async cleanupRoomIfEmpty(roomName) {
        const roomConfig = this.getRoomConfig(roomName);
        if (!roomConfig.ephemeral) return;

        const roomRef = this.database.ref(`rooms/${roomName}`);
        const usersRef = roomRef.child('users');
        const snapshot = await usersRef.once('value');
        let hasOnlineUsers = false;
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user && user.online) {
                hasOnlineUsers = true;
            }
        });

        if (!hasOnlineUsers) {
            await roomRef.remove();
        }
    },

    async leaveRoom(roomName = this.currentRoom) {
        const activeUsersRef = this.usersRef;
        const activeMessagesRef = this.messagesRef;
        if (this.usersRef && this.userId) {
            await this.usersRef.child(this.userId).update({ online: false });
        }
        
        if (activeUsersRef) {
            activeUsersRef.off();
        }
        if (activeMessagesRef) {
            activeMessagesRef.off();
        }

        await this.cleanupRoomIfEmpty(roomName);
        await this.syncRoomOccupancyCounts();
    },

    async switchRoom(roomName) {
        if (!roomName || roomName === this.currentRoom) {
            return { ok: true, previousRoom: this.currentRoom };
        }

        const previousRoom = this.currentRoom;
        const canJoin = await this.canJoinRoom(roomName);
        if (!canJoin.ok) {
            return { ok: false, reason: canJoin.reason, previousRoom };
        }

        await this.leaveRoom(previousRoom);
        this.setupRoom(roomName);
        this.lastMessageKey = null;
        const result = await this.joinRoom();
        if (!result.ok) {
            this.setupRoom(previousRoom);
            await this.joinRoom();
            return { ok: false, reason: result.reason, previousRoom };
        }

        return { ok: true, previousRoom };
    }
};

window.FirebaseChat = FirebaseChat;
