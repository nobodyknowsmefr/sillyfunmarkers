// Custom Pixel Emoji System
const EmojiSystem = {
    // Emoji definitions with shortcodes and SVG data URIs (pixel art style)
    emojis: [
        {
            code: ':happy:',
            name: 'Happy',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFD166" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="4" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="4" y="10" width="2" height="1"/>
                <rect fill="#1D3557" x="6" y="11" width="4" height="1"/>
                <rect fill="#1D3557" x="10" y="10" width="2" height="1"/>
            </svg>`
        },
        {
            code: ':sad:',
            name: 'Sad',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#A8DADC" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="4" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="4" y="11" width="2" height="1"/>
                <rect fill="#1D3557" x="6" y="10" width="4" height="1"/>
                <rect fill="#1D3557" x="10" y="11" width="2" height="1"/>
            </svg>`
        },
        {
            code: ':love:',
            name: 'Love',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#E63946" x="3" y="4" width="4" height="3"/>
                <rect fill="#E63946" x="9" y="4" width="4" height="3"/>
                <rect fill="#E63946" x="2" y="5" width="1" height="2"/>
                <rect fill="#E63946" x="13" y="5" width="1" height="2"/>
                <rect fill="#E63946" x="4" y="7" width="8" height="2"/>
                <rect fill="#E63946" x="5" y="9" width="6" height="2"/>
                <rect fill="#E63946" x="6" y="11" width="4" height="1"/>
                <rect fill="#E63946" x="7" y="12" width="2" height="1"/>
            </svg>`
        },
        {
            code: ':star:',
            name: 'Star',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFD166" x="7" y="1" width="2" height="2"/>
                <rect fill="#FFD166" x="6" y="3" width="4" height="2"/>
                <rect fill="#FFD166" x="1" y="5" width="14" height="2"/>
                <rect fill="#FFD166" x="2" y="7" width="12" height="2"/>
                <rect fill="#FFD166" x="3" y="9" width="10" height="2"/>
                <rect fill="#FFD166" x="3" y="11" width="3" height="2"/>
                <rect fill="#FFD166" x="10" y="11" width="3" height="2"/>
                <rect fill="#FFD166" x="2" y="13" width="2" height="2"/>
                <rect fill="#FFD166" x="12" y="13" width="2" height="2"/>
            </svg>`
        },
        {
            code: ':fire:',
            name: 'Fire',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#E63946" x="7" y="1" width="2" height="2"/>
                <rect fill="#E63946" x="6" y="3" width="4" height="2"/>
                <rect fill="#E63946" x="5" y="5" width="6" height="2"/>
                <rect fill="#FFD166" x="7" y="5" width="2" height="2"/>
                <rect fill="#E63946" x="4" y="7" width="8" height="3"/>
                <rect fill="#FFD166" x="6" y="7" width="4" height="2"/>
                <rect fill="#E63946" x="4" y="10" width="8" height="2"/>
                <rect fill="#FFD166" x="6" y="10" width="4" height="1"/>
                <rect fill="#E63946" x="5" y="12" width="6" height="2"/>
                <rect fill="#E63946" x="6" y="14" width="4" height="1"/>
            </svg>`
        },
        {
            code: ':cool:',
            name: 'Cool',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFD166" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="2" y="5" width="5" height="3"/>
                <rect fill="#1D3557" x="9" y="5" width="5" height="3"/>
                <rect fill="#118AB2" x="3" y="6" width="3" height="1"/>
                <rect fill="#118AB2" x="10" y="6" width="3" height="1"/>
                <rect fill="#1D3557" x="5" y="11" width="6" height="1"/>
            </svg>`
        },
        {
            code: ':laugh:',
            name: 'Laugh',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFD166" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="3" y="4" width="3" height="1"/>
                <rect fill="#1D3557" x="4" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="10" y="4" width="3" height="1"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="4" y="9" width="8" height="1"/>
                <rect fill="#E63946" x="5" y="10" width="6" height="2"/>
                <rect fill="#1D3557" x="4" y="12" width="8" height="1"/>
            </svg>`
        },
        {
            code: ':wink:',
            name: 'Wink',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFD166" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="3" y="6" width="4" height="1"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="5" y="10" width="1" height="1"/>
                <rect fill="#1D3557" x="6" y="11" width="4" height="1"/>
                <rect fill="#1D3557" x="10" y="10" width="1" height="1"/>
            </svg>`
        },
        {
            code: ':blush:',
            name: 'Blush',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFD166" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="4" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#F28482" x="3" y="8" width="2" height="2"/>
                <rect fill="#F28482" x="11" y="8" width="2" height="2"/>
                <rect fill="#1D3557" x="5" y="10" width="1" height="1"/>
                <rect fill="#1D3557" x="6" y="11" width="4" height="1"/>
                <rect fill="#1D3557" x="10" y="10" width="1" height="1"/>
            </svg>`
        },
        {
            code: ':angry:',
            name: 'Angry',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FF8A80" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="3" y="4" width="3" height="1"/>
                <rect fill="#1D3557" x="10" y="4" width="3" height="1"/>
                <rect fill="#1D3557" x="4" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="4" y="11" width="3" height="1"/>
                <rect fill="#1D3557" x="7" y="10" width="2" height="1"/>
                <rect fill="#1D3557" x="9" y="11" width="3" height="1"/>
            </svg>`
        },
        {
            code: ':sleepy:',
            name: 'Sleepy',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#BDE0FE" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="3" y="6" width="3" height="1"/>
                <rect fill="#1D3557" x="10" y="6" width="3" height="1"/>
                <rect fill="#1D3557" x="5" y="10" width="6" height="1"/>
                <rect fill="#1D3557" x="11" y="3" width="2" height="1"/>
                <rect fill="#1D3557" x="10" y="4" width="2" height="1"/>
                <rect fill="#1D3557" x="11" y="5" width="2" height="1"/>
            </svg>`
        },
        {
            code: ':shocked:',
            name: 'Shocked',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFF176" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="4" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="7" y="9" width="2" height="3" rx="1"/>
            </svg>`
        },
        {
            code: ':confused:',
            name: 'Confused',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#CDB4DB" x="2" y="2" width="12" height="12" rx="2"/>
                <rect fill="#1D3557" x="4" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="10" y="5" width="2" height="2"/>
                <rect fill="#1D3557" x="4" y="11" width="3" height="1"/>
                <rect fill="#1D3557" x="7" y="10" width="2" height="1"/>
                <rect fill="#1D3557" x="9" y="9" width="3" height="1"/>
            </svg>`
        },
        {
            code: ':thumbsup:',
            name: 'Thumbs Up',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#FFD166" x="6" y="1" width="3" height="2"/>
                <rect fill="#FFD166" x="6" y="3" width="4" height="2"/>
                <rect fill="#FFD166" x="5" y="5" width="6" height="2"/>
                <rect fill="#FFD166" x="3" y="7" width="10" height="2"/>
                <rect fill="#FFD166" x="3" y="9" width="9" height="2"/>
                <rect fill="#FFD166" x="3" y="11" width="8" height="2"/>
                <rect fill="#FFD166" x="3" y="13" width="7" height="2"/>
            </svg>`
        },
        {
            code: ':question:',
            name: 'Question',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#118AB2" x="5" y="2" width="6" height="2"/>
                <rect fill="#118AB2" x="4" y="3" width="2" height="2"/>
                <rect fill="#118AB2" x="10" y="3" width="2" height="2"/>
                <rect fill="#118AB2" x="9" y="5" width="2" height="2"/>
                <rect fill="#118AB2" x="7" y="7" width="2" height="3"/>
                <rect fill="#118AB2" x="7" y="12" width="2" height="2"/>
            </svg>`
        },
        {
            code: ':exclaim:',
            name: 'Exclaim',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#E63946" x="6" y="2" width="4" height="2"/>
                <rect fill="#E63946" x="6" y="4" width="4" height="2"/>
                <rect fill="#E63946" x="6" y="6" width="4" height="2"/>
                <rect fill="#E63946" x="7" y="8" width="2" height="2"/>
                <rect fill="#E63946" x="7" y="12" width="2" height="2"/>
            </svg>`
        },
        {
            code: ':music:',
            name: 'Music',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <rect fill="#118AB2" x="5" y="2" width="8" height="2"/>
                <rect fill="#118AB2" x="11" y="4" width="2" height="6"/>
                <rect fill="#118AB2" x="5" y="4" width="2" height="8"/>
                <rect fill="#118AB2" x="3" y="10" width="4" height="4" rx="2"/>
                <rect fill="#118AB2" x="9" y="8" width="4" height="4" rx="2"/>
            </svg>`
        },
        {
            code: ':circlekid:',
            name: 'Circle Kid',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#FFD166" cx="8" cy="5" r="3"/><rect fill="#1D3557" x="6" y="4" width="1" height="1"/><rect fill="#1D3557" x="9" y="4" width="1" height="1"/><rect fill="#1D3557" x="6" y="7" width="4" height="1"/><rect fill="#43A047" x="5" y="9" width="6" height="5" rx="2"/></svg>`
        },
        {
            code: ':squarepal:',
            name: 'Square Pal',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#A8DADC" x="4" y="2" width="8" height="8" rx="1"/><rect fill="#1D3557" x="6" y="4" width="1" height="1"/><rect fill="#1D3557" x="9" y="4" width="1" height="1"/><rect fill="#1D3557" x="6" y="7" width="4" height="1"/><rect fill="#E63946" x="5" y="10" width="6" height="4" rx="1"/></svg>`
        },
        {
            code: ':trianglepal:',
            name: 'Triangle Pal',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#FDD835" points="8,2 13,10 3,10"/><rect fill="#1D3557" x="6" y="6" width="1" height="1"/><rect fill="#1D3557" x="9" y="6" width="1" height="1"/><rect fill="#1D3557" x="6" y="8" width="4" height="1"/><rect fill="#118AB2" x="5" y="11" width="6" height="3" rx="1"/></svg>`
        },
        {
            code: ':diamondfriend:',
            name: 'Diamond Friend',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#43A047" points="8,1 13,6 8,11 3,6"/><rect fill="#ffffff" x="6" y="5" width="1" height="1"/><rect fill="#ffffff" x="9" y="5" width="1" height="1"/><rect fill="#ffffff" x="6" y="8" width="4" height="1"/><rect fill="#6D4C41" x="5" y="11" width="6" height="3" rx="1"/></svg>`
        },
        {
            code: ':shapecat:',
            name: 'Shape Cat',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#F4A261" points="5,2 7,2 6,4"/><polygon fill="#F4A261" points="9,2 11,2 10,4"/><rect fill="#F4A261" x="4" y="3" width="8" height="7" rx="2"/><rect fill="#1D3557" x="6" y="5" width="1" height="1"/><rect fill="#1D3557" x="9" y="5" width="1" height="1"/><rect fill="#1D3557" x="7" y="7" width="2" height="1"/><rect fill="#E76F51" x="5" y="10" width="6" height="4" rx="2"/></svg>`
        },
        {
            code: ':shapedog:',
            name: 'Shape Dog',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#8D6E63" x="3" y="3" width="10" height="7" rx="3"/><rect fill="#6D4C41" x="2" y="4" width="2" height="4" rx="1"/><rect fill="#6D4C41" x="12" y="4" width="2" height="4" rx="1"/><rect fill="#ffffff" x="6" y="5" width="1" height="1"/><rect fill="#ffffff" x="9" y="5" width="1" height="1"/><rect fill="#1D3557" x="7" y="7" width="2" height="1"/><rect fill="#90BE6D" x="5" y="10" width="6" height="4" rx="2"/></svg>`
        },
        {
            code: ':shapebird:',
            name: 'Shape Bird',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#4FC3F7" cx="7" cy="7" r="4"/><polygon fill="#FFB703" points="10,7 14,6 14,8"/><rect fill="#1D3557" x="6" y="6" width="1" height="1"/><rect fill="#1D3557" x="4" y="11" width="1" height="3"/><rect fill="#1D3557" x="8" y="11" width="1" height="3"/></svg>`
        },
        {
            code: ':shapefish:',
            name: 'Shape Fish',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><ellipse fill="#2EC4B6" cx="7" cy="8" rx="5" ry="3"/><polygon fill="#2EC4B6" points="11,8 15,5 15,11"/><rect fill="#ffffff" x="4" y="7" width="1" height="1"/><rect fill="#FF9F1C" x="7" y="5" width="2" height="6"/><rect fill="#FF9F1C" x="6" y="4" width="4" height="1"/></svg>`
        },
        {
            code: ':shapefox:',
            name: 'Shape Fox',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#F77F00" points="4,3 6,2 6,5"/><polygon fill="#F77F00" points="10,2 12,3 10,5"/><rect fill="#F77F00" x="4" y="4" width="8" height="6" rx="2"/><rect fill="#ffffff" x="6" y="7" width="4" height="2"/><rect fill="#1D3557" x="6" y="5" width="1" height="1"/><rect fill="#1D3557" x="9" y="5" width="1" height="1"/><rect fill="#F77F00" x="5" y="10" width="6" height="4" rx="2"/></svg>`
        },
        {
            code: ':shapebear:',
            name: 'Shape Bear',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#A47148" cx="5" cy="4" r="2"/><circle fill="#A47148" cx="11" cy="4" r="2"/><rect fill="#A47148" x="3" y="4" width="10" height="7" rx="3"/><rect fill="#1D3557" x="6" y="6" width="1" height="1"/><rect fill="#1D3557" x="9" y="6" width="1" height="1"/><rect fill="#F8E5C0" x="6" y="8" width="4" height="2" rx="1"/><rect fill="#A47148" x="5" y="11" width="6" height="3" rx="2"/></svg>`
        },
        {
            code: ':shaperabbit:',
            name: 'Shape Rabbit',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#F5F5F5" x="5" y="1" width="2" height="5" rx="1"/><rect fill="#F5F5F5" x="9" y="1" width="2" height="5" rx="1"/><rect fill="#F5F5F5" x="4" y="5" width="8" height="6" rx="3"/><rect fill="#1D3557" x="6" y="7" width="1" height="1"/><rect fill="#1D3557" x="9" y="7" width="1" height="1"/><rect fill="#E76F51" x="7" y="8" width="2" height="2"/><rect fill="#BDE0FE" x="5" y="11" width="6" height="3" rx="2"/></svg>`
        },
        {
            code: ':shapepanda:',
            name: 'Shape Panda',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#1D3557" cx="5" cy="4" r="2"/><circle fill="#1D3557" cx="11" cy="4" r="2"/><rect fill="#ffffff" x="3" y="4" width="10" height="7" rx="3"/><rect fill="#1D3557" x="5" y="6" width="2" height="2" rx="1"/><rect fill="#1D3557" x="9" y="6" width="2" height="2" rx="1"/><rect fill="#1D3557" x="7" y="8" width="2" height="1"/><rect fill="#90BE6D" x="5" y="11" width="6" height="3" rx="2"/></svg>`
        },
        {
            code: ':shapefrog:',
            name: 'Shape Frog',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#7CB518" cx="5" cy="4" r="2"/><circle fill="#7CB518" cx="11" cy="4" r="2"/><rect fill="#7CB518" x="3" y="5" width="10" height="6" rx="3"/><rect fill="#ffffff" x="5" y="4" width="1" height="1"/><rect fill="#ffffff" x="10" y="4" width="1" height="1"/><rect fill="#1D3557" x="6" y="7" width="4" height="1"/><rect fill="#2A9D8F" x="5" y="11" width="6" height="3" rx="2"/></svg>`
        },
        {
            code: ':shapeowl:',
            name: 'Shape Owl',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#8D6E63" points="5,3 7,4 5,6"/><polygon fill="#8D6E63" points="11,3 9,4 11,6"/><rect fill="#8D6E63" x="4" y="4" width="8" height="7" rx="2"/><circle fill="#ffffff" cx="6.5" cy="7" r="1.5"/><circle fill="#ffffff" cx="9.5" cy="7" r="1.5"/><rect fill="#FFB703" x="7" y="8" width="2" height="1"/><rect fill="#8D6E63" x="5" y="11" width="6" height="3" rx="2"/></svg>`
        },
        {
            code: ':shapeghost:',
            name: 'Shape Ghost',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#F7F7FF" x="4" y="2" width="8" height="10" rx="3"/><rect fill="#F7F7FF" x="4" y="11" width="2" height="3"/><rect fill="#F7F7FF" x="7" y="11" width="2" height="2"/><rect fill="#F7F7FF" x="10" y="11" width="2" height="3"/><rect fill="#1D3557" x="6" y="5" width="1" height="2"/><rect fill="#1D3557" x="9" y="5" width="1" height="2"/><rect fill="#1D3557" x="6" y="9" width="4" height="1"/></svg>`
        },
        {
            code: ':shapealien:',
            name: 'Shape Alien',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#8AC926" x="4" y="2" width="8" height="9" rx="4"/><rect fill="#1D3557" x="5" y="5" width="2" height="3" rx="1" transform="rotate(-20 6 6.5)"/><rect fill="#1D3557" x="9" y="5" width="2" height="3" rx="1" transform="rotate(20 10 6.5)"/><rect fill="#1D3557" x="6" y="9" width="4" height="1"/><rect fill="#6A4C93" x="5" y="11" width="6" height="3" rx="2"/></svg>`
        },
        {
            code: ':shapebee:',
            name: 'Shape Bee',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#E0FBFC" x="4" y="3" width="3" height="3" rx="1"/><rect fill="#E0FBFC" x="9" y="3" width="3" height="3" rx="1"/><rect fill="#FDD835" x="4" y="6" width="8" height="5" rx="2"/><rect fill="#1D3557" x="5" y="7" width="6" height="1"/><rect fill="#1D3557" x="5" y="9" width="6" height="1"/><rect fill="#1D3557" x="6" y="6" width="1" height="1"/><rect fill="#1D3557" x="9" y="6" width="1" height="1"/></svg>`
        },
        {
            code: ':shapepig:',
            name: 'Shape Pig',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#FFB3C6" points="5,2 7,2 6,4"/><polygon fill="#FFB3C6" points="9,2 11,2 10,4"/><rect fill="#FFB3C6" x="4" y="3" width="8" height="7" rx="3"/><rect fill="#1D3557" x="6" y="5" width="1" height="1"/><rect fill="#1D3557" x="9" y="5" width="1" height="1"/><rect fill="#F28482" x="6" y="7" width="4" height="2" rx="1"/><rect fill="#FFB3C6" x="5" y="10" width="6" height="4" rx="2"/></svg>`
        },
        {
            code: ':shapekoala:',
            name: 'Shape Koala',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#B0BEC5" cx="4.5" cy="4.5" r="2.5"/><circle fill="#B0BEC5" cx="11.5" cy="4.5" r="2.5"/><rect fill="#CFD8DC" x="3" y="4" width="10" height="7" rx="3"/><rect fill="#1D3557" x="6" y="6" width="1" height="1"/><rect fill="#1D3557" x="9" y="6" width="1" height="1"/><rect fill="#455A64" x="7" y="7" width="2" height="2" rx="1"/><rect fill="#CFD8DC" x="5" y="11" width="6" height="3" rx="2"/></svg>`
        },
        {
            code: ':shapechick:',
            name: 'Shape Chick',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#FFE066" cx="8" cy="7" r="5"/><rect fill="#1D3557" x="6" y="6" width="1" height="1"/><rect fill="#1D3557" x="9" y="6" width="1" height="1"/><polygon fill="#F77F00" points="8,8 10,9 8,10 6,9"/><rect fill="#F77F00" x="6" y="12" width="1" height="2"/><rect fill="#F77F00" x="9" y="12" width="1" height="2"/></svg>`
        },
        {
            code: ':redshape:',
            name: 'Red Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#E53935" points="8,1 14,5 12,13 4,13 2,5"/></svg>`
        },
        {
            code: ':blueshape:',
            name: 'Blue Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#1E88E5" x="3" y="3" width="10" height="10" rx="2"/></svg>`
        },
        {
            code: ':greenshape:',
            name: 'Green Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#43A047" points="8,1 13,8 8,15 3,8"/></svg>`
        },
        {
            code: ':yellowshape:',
            name: 'Yellow Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#FDD835" points="8,1 10,6 15,6 11,9 13,15 8,11 3,15 5,9 1,6 6,6"/></svg>`
        },
        {
            code: ':purpleshape:',
            name: 'Purple Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><circle fill="#7E57C2" cx="8" cy="8" r="5"/></svg>`
        },
        {
            code: ':orangeshape:',
            name: 'Orange Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#FB8C00" points="2,4 8,1 14,4 12,12 4,12"/></svg>`
        },
        {
            code: ':pinkshape:',
            name: 'Pink Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#EC407A" x="4" y="2" width="8" height="12" rx="4"/></svg>`
        },
        {
            code: ':unc:',
            name: 'Unc',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><rect fill="#4E342E" x="4" y="2" width="8" height="8" rx="3"/><rect fill="#F5F5F5" x="4" y="1" width="8" height="3" rx="2"/><rect fill="#111111" x="6" y="5" width="1" height="1"/><rect fill="#111111" x="9" y="5" width="1" height="1"/><rect fill="#111111" x="6" y="8" width="4" height="1"/><rect fill="#6D4C41" x="5" y="10" width="6" height="4" rx="2"/></svg>`
        },
        {
            code: ':blackshape:',
            name: 'Black Shape',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><polygon fill="#263238" points="8,1 14,8 8,15 2,8"/></svg>`
        }
    ],

    // Convert emoji code to img tag with data URI
    codeToImg(code) {
        const emoji = this.emojis.find(e => e.code === code);
        if (emoji) {
            const dataUri = 'data:image/svg+xml,' + encodeURIComponent(emoji.svg);
            return `<img class="emoji" src="${dataUri}" alt="${emoji.name}" title="${emoji.code}">`;
        }
        return code;
    },

    // Parse text and replace emoji codes with images
    parseEmojis(text) {
        let result = text;
        this.emojis.forEach(emoji => {
            const regex = new RegExp(emoji.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            result = result.replace(regex, this.codeToImg(emoji.code));
        });
        return result;
    },

    // Get all emoji data URIs for picker
    getAllEmojis() {
        return this.emojis.map(emoji => ({
            code: emoji.code,
            name: emoji.name,
            dataUri: 'data:image/svg+xml,' + encodeURIComponent(emoji.svg)
        }));
    },

    // Initialize emoji picker in the DOM
    initPicker(containerId, onSelect) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        this.getAllEmojis().forEach(emoji => {
            const item = document.createElement('div');
            item.className = 'emoji-item';
            item.title = emoji.code;
            item.innerHTML = `<img src="${emoji.dataUri}" alt="${emoji.name}">`;
            item.addEventListener('click', () => onSelect(emoji.code));
            container.appendChild(item);
        });
    }
};

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmojiSystem;
}
