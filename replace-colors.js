const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
    // text-white -> text-foreground (but preserve text-white/XX opacity variants)
    { regex: /text-white\/(\d+)/g, replace: 'text-foreground/$1' },
    { regex: /\btext-white\b/g, replace: 'text-foreground' },

    // border-white/XX -> border-foreground/XX
    { regex: /border-white\/(\d+)/g, replace: 'border-foreground/$1' },
    { regex: /\bborder-white\b/g, replace: 'border-foreground' },

    // bg-white/XX -> bg-foreground/XX
    { regex: /bg-white\/(\d+)/g, replace: 'bg-foreground/$1' },

    // rounded-2xl on cards -> use CSS var
    // rounded-[2rem] and rounded-[3rem] -> use CSS var
    { regex: /rounded-\[2rem\]/g, replace: 'rounded-[var(--container-radius)]' },
    { regex: /rounded-\[3rem\]/g, replace: 'rounded-[var(--container-radius)]' },
    { regex: /rounded-t-\[2rem\]/g, replace: 'rounded-t-[var(--container-radius)]' },
    { regex: /rounded-t-\[3rem\]/g, replace: 'rounded-t-[var(--container-radius)]' },
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            replacements.forEach(({ regex, replace }) => {
                content = content.replace(regex, replace);
            });

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${path.relative(__dirname, fullPath)}`);
            }
        }
    });
}

processDirectory(dir);
console.log('Done!');
