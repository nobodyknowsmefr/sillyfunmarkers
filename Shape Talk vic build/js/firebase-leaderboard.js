// Firebase Leaderboard System for Ball Bounce Game
const FirebaseLeaderboard = {
    database: null,
    leaderboardRef: null,
    currentUserScore: 0,

    init() {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase not loaded, leaderboard disabled');
            return false;
        }

        try {
            this.database = firebase.database();
            this.leaderboardRef = this.database.ref('leaderboard/ballBounce');
            return true;
        } catch (error) {
            console.error('Firebase leaderboard init error:', error);
            return false;
        }
    },

    submitScore(username, score) {
        if (!this.leaderboardRef || score === 0) {
            return false;
        }

        const scoreData = {
            username: username,
            score: score,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        // Use username as key to keep only best score per user
        this.leaderboardRef.child(username.replace(/[.#$[\]]/g, '_')).set(scoreData);
        
        return true;
    },

    getTopScores(limit = 10, callback) {
        if (!this.leaderboardRef) {
            callback([]);
            return;
        }

        this.leaderboardRef
            .orderByChild('score')
            .limitToLast(limit)
            .once('value', (snapshot) => {
                const scores = [];
                snapshot.forEach((childSnapshot) => {
                    scores.push(childSnapshot.val());
                });
                // Reverse to get highest first
                scores.reverse();
                callback(scores);
            });
    },

    listenToTopScores(limit = 10, callback) {
        if (!this.leaderboardRef) {
            callback([]);
            return;
        }

        this.leaderboardRef
            .orderByChild('score')
            .limitToLast(limit)
            .on('value', (snapshot) => {
                const scores = [];
                snapshot.forEach((childSnapshot) => {
                    scores.push(childSnapshot.val());
                });
                // Reverse to get highest first
                scores.reverse();
                callback(scores);
            });
    },

    stopListening() {
        if (this.leaderboardRef) {
            this.leaderboardRef.off();
        }
    }
};

window.FirebaseLeaderboard = FirebaseLeaderboard;
