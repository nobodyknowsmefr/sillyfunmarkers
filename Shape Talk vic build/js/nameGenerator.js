// Anonymous Name Generator - OG Style Names
const NameGenerator = {
    firstNames: [
        'Leroy', 'Willie', 'Earl', 'Curtis', 'Leon',
        'Alvin', 'Calvin', 'Melvin', 'Marvin', 'Clarence',
        'Darnell', 'Darryl', 'Terrence', 'Lawrence', 'Reginald',
        'Jerome', 'Tyrone', 'Roosevelt', 'Cleveland', 'Franklin',
        'Otis', 'Herman', 'Virgil', 'Elbert', 'Wilbert',
        'Theodore', 'Nathaniel', 'Cornelius', 'Percy', 'Stanley',
        'Bennie', 'Freddie', 'Eddie', 'Johnny', 'Bobby',
        'Tommy', 'Ricky', 'Jimmy', 'Kenny', 'Raymond',
        'Samuel', 'Isaiah', 'Moses', 'Elijah', 'Isaac',
        'George', 'Henry', 'Walter', 'Arthur', 'Louis',
        'Clifford', 'Bernard', 'Douglas', 'Harold', 'Gerald',
        'Milton', 'Luther', 'Clyde', 'Chester', 'Floyd',
        'Vernon', 'Eugene', 'Howard', 'Dwight', 'Roland',
        'Ray', 'Lee', 'Joe', 'Carl', 'Fred',
        'Bo', 'Sonny', 'Junior'
    ],

    lastNames: [
        'Johnson', 'Brown', 'Davis', 'Jackson', 'Robinson',
        'Carter', 'Harris', 'Scott', 'Green', 'Hill',
        'Adams', 'Baker', 'Nelson', 'Mitchell', 'Turner',
        'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards',
        'Collins', 'Stewart', 'Morris', 'Rogers', 'Cook',
        'Morgan', 'Reed', 'Bailey', 'Richardson', 'Cox',
        'Howard', 'Ward', 'Peterson', 'Gray', 'James',
        'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price',
        'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson',
        'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long',
        'Patterson', 'Hughes', 'Washington', 'Butler', 'Simmons',
        'Foster', 'Bryant', 'Alexander', 'Russell', 'Griffin',
        'Hayes', 'Myers', 'Diaz', 'Gonzales', 'Thomas',
        'Williams'
    ],

    shapeNames: [
        'Circle', 'Square', 'Triangle', 'Diamond', 'Rhombus',
        'Oval', 'Hexagon', 'Octagon', 'Trapezoid', 'Pentagon',
        'Star', 'Cube'
    ],

    currentUsername: null,

    pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    },

    randomDigits() {
        return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    },

    // Generate a random name
    generate() {
        const roll = Math.random();
        let baseName = '';

        if (roll < 0.07) {
            baseName = this.pickRandom(this.shapeNames);
        } else if (roll < 0.32) {
            const singlePool = Math.random() < 0.5 ? this.firstNames : this.lastNames;
            baseName = this.pickRandom(singlePool);
        } else {
            baseName = `${this.pickRandom(this.firstNames)}${this.pickRandom(this.lastNames)}`;
        }

        return `${baseName}${this.randomDigits()}`;
    },

    // Get or create username from session
    getOrCreateUsername() {
        if (!this.currentUsername) {
            this.currentUsername = this.generate();
        }
        return this.currentUsername;
    },

    // Force generate a new username
    regenerateUsername() {
        this.currentUsername = this.generate();
        return this.currentUsername;
    }
};

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NameGenerator;
}
