// Import styles
import './styles/main.css';
import './styles/header.css';
import './styles/repos.css';

// Import GitHub colors
import { colors } from './gh-colors';

// A function which creates and returns a HTML element with specified name (tag) and text.
const createElem = (elementName, elementText) => {
    // Create a HTML element
    let element = document.createElement(elementName);

    // If elementText is specified, add a textnode, otherwise don't.
    if (elementText) {
        element.appendChild(
            document.createTextNode(elementText) // Append a text node
        )
    };

    return element // Return element
};

// A function which updates the repositories section. Takes the GitHub api response as input.
const updateRepoSection = (data) => {

    // Loop through each repo and create an article element with the correct data.
    for (let repo of data) {
        let articleElement = createElem('article', null); // Create article element.

        // Repository name
        if (repo.name) { // If name is specified, add an h3 element with it
            let headerLinkElem = createElem('a', null);
            headerLinkElem.href = repo.html_url;
            headerLinkElem.style.textDecoration = 'none'; // Remove undeline
            headerLinkElem.appendChild(
                createElem('h3', repo.name)
            )

            articleElement.appendChild(headerLinkElem);
        }

        // Repo description
        if (repo.description) {
            articleElement.appendChild(
                createElem('p', repo.description)
            );
        }

        // Repo URL
        if (repo.homepage) {
            let display_link = repo.homepage.replace(/https?.\/\//, '');
            let linkElem = createElem('a', display_link);

            linkElem.href = repo.homepage; // Add url to <a>
            linkElem.target = "_blank";

            articleElement.appendChild(linkElem);
        }

        // Repo language
        if (repo.language) {
            let langElem = createElem('p', repo.language);

            let langdotElem = createElem('i', null);
            langdotElem.classList.add('lang-dot'); // Add lang-dot to class list
            langdotElem.style.backgroundColor = colors[repo.language] || 'var(--text-main)'; // Change background color to language specific one.
            
            // Append dot element to language element before the first child; i.e. put it first.
            langElem.insertBefore(langdotElem, langElem.firstChild);

            articleElement.appendChild(langElem);
        }

        // Repo date
        if (repo.pushed_at) {
            let date = new Date(repo.pushed_at).toLocaleDateString();
            articleElement.appendChild(
                createElem('p', `Last updated ${date}`)
            );
        }

        document.getElementById('repos').appendChild(articleElement);
    }
}

// Sort data by last updated
const sortData = (data) => {
    data.sort((a, b) => new Date(b['pushed_at']) - new Date(a['pushed_at']));

    return data;
};

// Fetch repo data using github API
fetch('https://api.github.com/users/ohman-emil/repos')
     // Convert response to json
    .then(data => data.json())

    // Change content to sorted response and update the repo section
    .then(data => updateRepoSection(sortData(data)))

    // When the data is successfully fetched, display the repos section
    .then(_ => document.getElementById('repos').style.display = 'block')
    
    // Error handling
    .catch(e => console.log(e));
