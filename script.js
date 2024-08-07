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
  element.querySelector('.card-name').textContent = `Name: ${item.name}`
  element.querySelector('.card-owner').textContent = `Owner: ${item.owner.login}`
  element.querySelector('.card-stars').textContent = `Stars: ${item.stargazers_count}`
  element.querySelector('.card-button-delete').addEventListener('click', (e) => {
    e.target.parentNode.remove()
  })
  searchResult.append(element)
  searchField.value = ''
  searchElement.textContent = ''

}

const repositories = async (req) => {
  return await fetch(`https://api.github.com/search/repositories?q=${req}`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    }
  })

  .then(response => {
    if (response.ok) {
      
      response.json().then(repository => {
        searchElement.textContent = '';
        const items = repository.items.slice(0, 5);

          if (items.length === 0) {
            searchElement.textContent = 'Ничего не найдено'
          
          } else {
            items.forEach(item => {
              const foundElement = document.createElement('p')
              foundElement.className = 'found'
              foundElement.textContent = `${item.name}`
              foundElement.addEventListener('click', () => addCard(item))
              searchElement.append(foundElement)
            })
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

searchField.addEventListener('keyup', onChange);
