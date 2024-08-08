const searchField = document.querySelector('.search-field')
const searchElement = document.querySelector('.search-element')

const selectCard = document.querySelector('.select-repos')
const searchResult = document.querySelector('.search-result')



const debounce = (fn, ms) => {
  let timeout;
  return function () {
    const call = () => {
      fn.apply(this, arguments)
    }
    clearTimeout(timeout);
    timeout = setTimeout(call, ms);
  }
}

const addCard = (item) => {
  let element = document.createElement('div');
  element.append(selectCard.content.cloneNode(true));

  const cardName = element.querySelector('.card-name');
  const cardOwner = element.querySelector('.card-owner');
  const cardStars = element.querySelector('.card-stars');
  const cardButtonDelete = element.querySelector('.card-button-delete');

  cardName.textContent = `Name: ${item.name}`
  cardOwner.textContent = `Owner: ${item.owner.login}`
  cardStars.textContent = `Stars: ${item.stargazers_count}`
  cardButtonDelete.addEventListener('click', (e) => {
    e.target.parentNode.remove()
  })
  searchResult.append(element)
  searchField.value = ''
  searchElement.textContent = ''

}

const repositories = async (req) => {
  return await fetch(`https://api.github.com/search/repositories?q=${req}&per_page=5`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    }
  })

  .then(response => {
    if (response.ok) {
      
      response.json().then(repository => {
        searchElement.textContent = '';
        const items = repository.items;

          if (items.length === 0) {
            searchElement.textContent = 'Ничего не найдено'
          
          } else {
            const arrFoundElement = [];
            items.forEach(item => {
              const foundElement = document.createElement('p')
              foundElement.className = 'found'
              foundElement.textContent = `${item.name}`
              foundElement.addEventListener('click', () => addCard(item))
              arrFoundElement.push(foundElement)
              
            })
            searchElement.append(...arrFoundElement)
            
          } 
      })
    
    } else {
      searchElement.textContent = ''
    }
    
  })
}


function onChange(e) {
  const enterInfo = e.target.value;
  if (enterInfo[0] === ' ') {
    return
  }
  repositories(enterInfo)
}

onChange = debounce(onChange, 400);

searchField.addEventListener('input', onChange);
