const fs = require('fs');

let content = fs.readFileSync('about.html', 'utf8');

const targetRegex = /<h1[^>]*>[\s\S]*?Hi, I'm Rafael.[\s\S]*?<\/h1>\s*<p[^>]*>[\s\S]*?<\/p>/;
const newContent = `<h1 class="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary">
                    About <br>
<span style="font-family: 'Proxima Nova', 'Montserrat', sans-serif; font-size: 34px; font-weight: 900; letter-spacing: -1px; color: white;">RaphaAtlas</span>
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    RaphaAtlas Rapha means: health and Atlas: a complete guide of, it covers nutriton, health, calculators, fitness and is a complete guide of nutrition, health, health calculators and fitness, a project of Growth Partners Global LLC.
                </p>`;

if (content.match(targetRegex)) {
    content = content.replace(targetRegex, newContent);
    fs.writeFileSync('about.html', content);
    console.log("Replaced about.html text successfully.");
} else {
    console.log("Could not find about text to replace.");
}
