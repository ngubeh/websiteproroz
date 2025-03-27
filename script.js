// DOM Elements
const landingPage = document.getElementById("landing-page")
const authSection = document.getElementById("auth-section")
const app = document.getElementById("app")
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-form")
const signupSuccess = document.getElementById("signup-success")
const tabBtns = document.querySelectorAll(".tab-btn")
const navLinks = document.querySelectorAll(".nav-link")
const logoutBtn = document.getElementById("logout-btn")
const userName = document.getElementById("user-name")
const pages = document.querySelectorAll(".page")
const newsContainer = document.getElementById("news-container")
const filterBtns = document.querySelectorAll(".filter-btn")
const backToNewsBtn = document.getElementById("back-to-news")
const likeBtn = document.getElementById("like-btn")
const dislikeBtn = document.getElementById("dislike-btn")
const commentForm = document.getElementById("comment-form")
const commentInput = document.getElementById("comment-input")
const commentsContainer = document.getElementById("comments-container")
const contactForm = document.getElementById("contact-form")
const getStartedButtons = document.querySelectorAll("#get-started-nav, #get-started-hero, #get-started-bottom")
const backToLandingLink = document.getElementById("back-to-landing-link")
const gotoLoginBtn = document.getElementById("goto-login")

// State
let currentUser = null
let currentArticle = null
let articles = []
const comments = []
const registeredUsers = []

// Initialize the app
function init() {
  loadArticles()
  setupEventListeners()
  checkLoggedInStatus()
}

// Check if user is logged in
function checkLoggedInStatus() {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    userName.textContent = currentUser.name
    showApp()
  }
}

// Show the landing page
function showLandingPage() {
  landingPage.classList.add("active-section")
  landingPage.classList.remove("hidden")
  authSection.classList.add("hidden")
  authSection.classList.remove("active-section")
  app.classList.add("hidden")
}

// Show the auth section
function showAuthSection() {
  landingPage.classList.remove("active-section")
  landingPage.classList.add("hidden")
  authSection.classList.remove("hidden")
  authSection.classList.add("active-section")
  app.classList.add("hidden")

  // Reset forms
  loginForm.reset()
  signupForm.reset()

  // Show login form by default
  tabBtns.forEach((btn) => {
    if (btn.dataset.tab === "login") {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })

  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.remove("active")
  })
  loginForm.classList.add("active")

  // Hide signup success message
  signupSuccess.classList.add("hidden")
}

// Show the main app and hide auth section and landing page
function showApp() {
  landingPage.classList.remove("active-section")
  landingPage.classList.add("hidden")
  authSection.classList.remove("active-section")
  authSection.classList.add("hidden")
  app.classList.remove("hidden")
}

// Setup event listeners
function setupEventListeners() {
  // Get Started buttons
  getStartedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showAuthSection()
    })
  })

  // Back to landing link
  backToLandingLink.addEventListener("click", (e) => {
    e.preventDefault()
    showLandingPage()
  })

  // Go to login button (after signup success)
  gotoLoginBtn.addEventListener("click", () => {
    // Show login form
    tabBtns.forEach((btn) => {
      if (btn.dataset.tab === "login") {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })

    document.querySelectorAll(".auth-form").forEach((form) => {
      form.classList.remove("active")
    })
    loginForm.classList.add("active")

    // Hide signup success message
    signupSuccess.classList.add("hidden")
  })

  // Auth tabs
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const tabId = btn.dataset.tab
      document.querySelectorAll(".auth-form").forEach((form) => {
        form.classList.remove("active")
      })
      document.getElementById(`${tabId}-form`).classList.add("active")

      // Hide signup success message when switching tabs
      signupSuccess.classList.add("hidden")
    })
  })

  // Login form
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    // Simple validation
    if (!email || !password) {
      alert("Please fill in all fields")
      return
    }

    // Check if user exists in registered users
    const user = registeredUsers.find((user) => user.email === email && user.password === password)

    if (!user) {
      alert("Invalid email or password")
      return
    }

    // Login successful
    currentUser = {
      name: user.name,
      email: user.email,
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    userName.textContent = currentUser.name
    showApp()
  })

  // Signup form
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const name = document.getElementById("signup-name").value
    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value
    const confirmPassword = document.getElementById("signup-confirm-password").value

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    // Check if email already exists
    if (registeredUsers.some((user) => user.email === email)) {
      alert("Email already registered")
      return
    }

    // Register user
    const newUser = {
      name: name,
      email: email,
      password: password,
    }

    registeredUsers.push(newUser)

    // Show success message
    signupForm.classList.remove("active")
    signupSuccess.classList.remove("hidden")
  })

  // Navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      const pageId = link.dataset.page
      showPage(pageId)
    })
  })

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser")
    currentUser = null
    showLandingPage()
  })

  // Category filters
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const category = btn.dataset.category
      filterArticles(category)
    })
  })

  // Back to news button
  backToNewsBtn.addEventListener("click", () => {
    showPage("home")
  })

  // Like button
  likeBtn.addEventListener("click", () => {
    if (!currentArticle) return

    currentArticle.likes++
    document.getElementById("like-count").textContent = currentArticle.likes

    // In a real app, you would update this on the backend
    updateArticleInList(currentArticle)
  })

  // Dislike button
  dislikeBtn.addEventListener("click", () => {
    if (!currentArticle) return

    currentArticle.dislikes++
    document.getElementById("dislike-count").textContent = currentArticle.dislikes

    // In a real app, you would update this on the backend
    updateArticleInList(currentArticle)
  })

  // Comment form
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!currentArticle || !commentInput.value.trim()) return

    const newComment = {
      id: Date.now(),
      articleId: currentArticle.id,
      author: currentUser.name,
      content: commentInput.value.trim(),
      date: new Date().toISOString(),
    }

    comments.push(newComment)
    commentInput.value = ""

    // In a real app, you would save this to the backend
    renderComments()
  })

  // Contact form
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = document.getElementById("contact-name").value
    const email = document.getElementById("contact-email").value
    const subject = document.getElementById("contact-subject").value
    const message = document.getElementById("contact-message").value

    // Simple validation
    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields")
      return
    }

    // In a real app, you would send this to the backend
    alert("Your message has been sent. We will get back to you soon!")
    contactForm.reset()
  })

  // Footer links
  document.querySelectorAll(".footer-column a[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const pageId = link.dataset.page
      showPage(pageId)

      // Update nav links
      navLinks.forEach((l) => {
        l.classList.remove("active")
        if (l.dataset.page === pageId) {
          l.classList.add("active")
        }
      })
    })
  })
}

// Show a specific page
function showPage(pageId) {
  pages.forEach((page) => {
    page.classList.remove("active-page")
  })

  document.getElementById(`${pageId}-page`).classList.add("active-page")

  // Scroll to top
  window.scrollTo(0, 0)
}

// Load articles (in a real app, this would fetch from an API)
function loadArticles() {
  articles = [
    {
      id: 1,
      title: "Global Climate Summit Reaches Historic Agreement",
      excerpt:
        "World leaders have reached a landmark agreement at the Global Climate Summit, pledging to reduce carbon emissions by 50% by 2030.",
      content: `<p>World leaders have reached a landmark agreement at the Global Climate Summit, pledging to reduce carbon emissions by 50% by 2030. The agreement, which was signed by 195 countries, marks a significant step forward in the global fight against climate change.</p>
                     <p>The summit, which was held in Geneva, Switzerland, brought together heads of state, environmental experts, and activists from around the world. After two weeks of intense negotiations, the participants emerged with what many are calling a "historic" agreement.</p>
                     <p>"This is a turning point in our fight against climate change," said UN Secretary-General Antonio Guterres. "For the first time, we have a clear, ambitious, and achievable plan to reduce carbon emissions and limit global warming to 1.5 degrees Celsius."</p>
                     <p>The agreement includes a number of key provisions, including:</p>
                     <ul>
                         <li>A commitment to reduce carbon emissions by 50% by 2030</li>
                         <li>A pledge to achieve carbon neutrality by 2050</li>
                         <li>A $100 billion fund to help developing countries transition to clean energy</li>
                         <li>A ban on new coal-fired power plants</li>
                     </ul>
                     <p>Environmental activists have welcomed the agreement, but some have expressed concerns about the lack of enforcement mechanisms. "This is a step in the right direction, but we need to ensure that countries actually follow through on their commitments," said Greta Thunberg, the Swedish climate activist.</p>
                     <p>The agreement will now need to be ratified by the parliaments of the participating countries, a process that is expected to take several months. Once ratified, countries will be required to submit detailed plans on how they intend to meet their emission reduction targets.</p>`,
      category: "politics",
      author: "Rajveer xavier",
      date: "2023-06-15",
      image: "climatejpeg.jpeg",
      likes: 245,
      dislikes: 12,
    },
    {
      id: 2,
      title: "New AI Model Can Predict Protein Structures with Unprecedented Accuracy",
      excerpt:
        "Scientists have developed a new artificial intelligence model that can predict the 3D structure of proteins with unprecedented accuracy, a breakthrough that could revolutionize drug discovery.",
      content: `<p>Scientists have developed a new artificial intelligence model that can predict the 3D structure of proteins with unprecedented accuracy, a breakthrough that could revolutionize drug discovery and our understanding of biological processes.</p>
                     <p>The model, developed by researchers at DeepMind, a subsidiary of Alphabet Inc., can predict the structure of a protein from its amino acid sequence with an accuracy comparable to experimental methods, but in a fraction of the time.</p>
                     <p>"This is a major advance in the field of structural biology," said Dr. John Moult, a professor at the University of Maryland and the founder of CASP (Critical Assessment of protein Structure Prediction), a biennial competition that evaluates the state of the art in protein structure prediction. "DeepMind's model has achieved what many thought was impossible."</p>
                     <p>Proteins are complex molecules that play a crucial role in virtually all biological processes. Their function is largely determined by their 3D structure, which has traditionally been determined through experimental methods such as X-ray crystallography and cryo-electron microscopy. These methods, while accurate, are time-consuming and expensive.</p>
                     <p>The new AI model, called AlphaFold 2, uses deep learning to predict protein structures from their amino acid sequences. It was trained on a database of known protein structures and has learned to predict the 3D coordinates of all heavy atoms in a protein.</p>
                     <p>The implications of this breakthrough are far-reaching. It could accelerate drug discovery by allowing scientists to quickly determine the structure of proteins involved in diseases. It could also help in the design of new enzymes for industrial applications and in the development of new materials.</p>
                     <p>"This is just the beginning," said Demis Hassabis, the CEO of DeepMind. "We believe that AI has the potential to accelerate scientific discovery and help us tackle some of the world's most pressing challenges."</p>`,
      category: "technology",
      author: "John Doe",
      date: "2023-06-10",
      image: "ai.webp",
      likes: 189,
      dislikes: 5,
    },
    {
      id: 3,
      title: "Major League Baseball Announces Expansion to 32 Teams",
      excerpt:
        "Major League Baseball has announced plans to expand to 32 teams, with new franchises in Las Vegas and Nashville set to begin play in 2026.",
      content: `<p>Major League Baseball has announced plans to expand to 32 teams, with new franchises in Las Vegas and Nashville set to begin play in 2026. The expansion, which was approved unanimously by the league's owners, marks the first time MLB has added new teams since the Arizona Diamondbacks and Tampa Bay Rays joined the league in 1998.</p>
                     <p>"This is an exciting day for baseball," said MLB Commissioner Rob Manfred. "Las Vegas and Nashville are vibrant, growing markets with passionate sports fans. We're confident that these new franchises will be successful and will help grow the game of baseball."</p>
                     <p>The Las Vegas franchise, which will be known as the Las Vegas Aces, will play in a new stadium to be built on the Las Vegas Strip. The Nashville franchise, which will be called the Nashville Stars in honor of the Negro League team that played in the city in the 1940s and 1950s, will play in a new stadium to be built along the Cumberland River.</p>
                     <p>Both franchises will pay an expansion fee of $2 billion, a significant increase from the $130 million paid by the Diamondbacks and Rays in 1998. The expansion fees will be distributed equally among the existing 30 teams.</p>
                     <p>The addition of two new teams will necessitate a realignment of the league's divisions. Under the new structure, each league will have two divisions of eight teams, rather than the current three divisions of five teams. The playoff format will also be adjusted, with the top three teams in each division qualifying for the postseason.</p>
                     <p>The expansion draft, in which the new teams will select players from the existing teams, is scheduled for December 2025. Each existing team will be allowed to protect a certain number of players from being selected.</p>
                     <p>"This is a complex process, but we're confident that it will result in competitive teams in Las Vegas and Nashville," said Manfred. "We're committed to ensuring that all 32 teams have an opportunity to compete for a championship."</p>`,
      category: "sports",
      author: "Mike Johnson",
      date: "2023-06-05",
      image: "baseball.jpg",
      likes: 132,
      dislikes: 28,
    },
    {
      id: 4,
      title: "Tech Giant Unveils Revolutionary Quantum Computer",
      excerpt:
        "A leading tech company has unveiled what it claims is the world's first commercially viable quantum computer, capable of solving complex problems in seconds that would take traditional computers thousands of years.",
      content: `<p>A leading tech company has unveiled what it claims is the world's first commercially viable quantum computer, capable of solving complex problems in seconds that would take traditional computers thousands of years. The machine, called Quantum One, represents a significant leap forward in quantum computing technology.</p>
                     <p>"This is a watershed moment in the history of computing," said Dr. Sarah Chen, the chief quantum officer at the company. "Quantum One is not just a research tool; it's a practical, commercial quantum computer that can solve real-world problems."</p>
                     <p>Quantum computers leverage the principles of quantum mechanics to perform calculations. Unlike traditional computers, which use bits that can be either 0 or 1, quantum computers use quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to explore multiple solutions to a problem at the same time.</p>
                     <p>Quantum One features 1,000 qubits, a significant increase from the company's previous quantum computer, which had 127 qubits. The machine is housed in a specially designed facility that shields it from external interference, which can disrupt the delicate quantum states.</p>
                     <p>The company demonstrated Quantum One's capabilities by using it to simulate a complex chemical reaction, a task that would be virtually impossible for a traditional computer. The simulation could lead to the development of new materials and drugs.</p>
                     <p>"Quantum computing has the potential to revolutionize fields ranging from cryptography to materials science to drug discovery," said Chen. "We're just beginning to scratch the surface of what's possible."</p>
                     <p>The company plans to make Quantum One available to researchers and businesses through a cloud-based service. It has also established a $100 million fund to support the development of quantum computing applications.</p>`,
      category: "technology",
      author: "Lisa Wang",
      date: "2023-06-01",
      image: "quantum.jpg",
      likes: 210,
      dislikes: 8,
    },
    {
      id: 5,
      title: "Global Economy Shows Signs of Recovery After Pandemic",
      excerpt:
        "The global economy is showing signs of a strong recovery from the COVID-19 pandemic, with growth projections being revised upward for most major economies.",
      content: `<p>The global economy is showing signs of a strong recovery from the COVID-19 pandemic, with growth projections being revised upward for most major economies. The International Monetary Fund (IMF) now expects global GDP to grow by 6.0% in 2023, up from its previous forecast of 5.5%.</p>
                     <p>"The recovery is stronger than we anticipated," said IMF Chief Economist Gita Gopinath. "Vaccination campaigns, adaptive economic policies, and the resilience of businesses and consumers have all contributed to this positive outlook."</p>
                     <p>The United States is leading the recovery among advanced economies, with the IMF projecting growth of 7.0% in 2023, the fastest pace since 1984. The European Union and Japan are also expected to see strong growth, with projections of 4.6% and 3.3%, respectively.</p>
                     <p>Among emerging markets, China is expected to grow by 8.4%, India by 12.5%, and Brazil by 3.7%. However, the IMF warned that the recovery is uneven, with many low-income countries still struggling.</p>
                     <p>"The pandemic has exacerbated inequalities both within and between countries," said Gopinath. "We need to ensure that the recovery is inclusive and benefits all segments of society."</p>
                     <p>The IMF also highlighted several risks to the outlook, including the emergence of new COVID-19 variants, the premature withdrawal of economic support measures, and rising inflation. It urged policymakers to maintain supportive policies until the recovery is firmly established.</p>
                     <p>"This is not the time for complacency," said Gopinath. "The recovery is still fragile and could be derailed by policy missteps or unforeseen shocks."</p>`,
      category: "politics",
      author: "Robert Chen",
      date: "2023-05-28",
      image: "pand.jpg",
      likes: 98,
      dislikes: 15,
    },
    {
      id: 6,
      title: "Record-Breaking Heatwave Sweeps Across Europe",
      excerpt:
        "A record-breaking heatwave is sweeping across Europe, with temperatures exceeding 40°C (104°F) in several countries, prompting health warnings and emergency measures.",
      content: `<p>A record-breaking heatwave is sweeping across Europe, with temperatures exceeding 40°C (104°F) in several countries, prompting health warnings and emergency measures. The heatwave, which meteorologists have named "Lucifer," is expected to last for at least another week.</p>
                     <p>"This is an unprecedented heatwave in terms of its intensity, duration, and geographical extent," said Dr. Carlo Buontempo, director of the Copernicus Climate Change Service. "It's a stark reminder of the reality of climate change."</p>
                     <p>Spain, Portugal, France, Italy, Greece, and parts of Eastern Europe are the most affected, with temperatures reaching as high as 45°C (113°F) in some areas. Several countries have set new temperature records, including Spain, where the mercury hit 47.2°C (117°F) in Montoro, a town in the southern province of Córdoba.</p>
                     <p>The extreme heat has led to a surge in heat-related illnesses, with hospitals reporting an increase in cases of heat exhaustion and heatstroke. Authorities have issued health warnings and advised people to stay indoors during the hottest parts of the day, drink plenty of water, and check on vulnerable individuals.</p>
                     <p>The heatwave has also sparked wildfires in several countries, particularly in the Mediterranean region. In Greece, firefighters are battling dozens of wildfires, with the largest one on the island of Rhodes forcing the evacuation of several villages.</p>
                     <p>The extreme heat is also affecting agriculture, with farmers reporting damage to crops and livestock. In Italy, agricultural association Coldiretti has warned that the heatwave could cost the country's agricultural sector billions of euros in losses.</p>
                     <p>Climate scientists have linked the increasing frequency and intensity of heatwaves to climate change. "What we're seeing is consistent with what climate models have been predicting for decades," said Buontempo. "As the planet warms, heatwaves are becoming more frequent, more intense, and longer-lasting."</p>`,
      category: "politics",
      author: "Elena Martinez",
      date: "2023-05-20",
      image: "heat.jpg",
      likes: 156,
      dislikes: 7,
    },
  ]

  renderArticles()
}

// Render articles in the news container
function renderArticles() {
  newsContainer.innerHTML = ""

  articles.forEach((article) => {
    const articleElement = document.createElement("div")
    articleElement.className = "news-card"
    articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="news-img">
            <div class="news-content">
                <span class="news-category">${article.category}</span>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${article.excerpt}</p>
                <div class="news-meta">
                    <span>${article.author}</span>
                    <span>${formatDate(article.date)}</span>
                </div>
                <button class="btn btn-primary read-more" data-id="${article.id}">Read More</button>
            </div>
        `

    newsContainer.appendChild(articleElement)

    // Add event listener to the read more button
    articleElement.querySelector(".read-more").addEventListener("click", () => {
      showArticle(article.id)
    })
  })
}

// Filter articles by category
function filterArticles(category) {
  if (category === "all") {
    renderArticles()
    return
  }

  const filteredArticles = articles.filter((article) => article.category === category)

  newsContainer.innerHTML = ""

  if (filteredArticles.length === 0) {
    newsContainer.innerHTML = '<p class="no-results">No articles found in this category.</p>'
    return
  }

  filteredArticles.forEach((article) => {
    const articleElement = document.createElement("div")
    articleElement.className = "news-card"
    articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="news-img">
            <div class="news-content">
                <span class="news-category">${article.category}</span>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${article.excerpt}</p>
                <div class="news-meta">
                    <span>${article.author}</span>
                    <span>${formatDate(article.date)}</span>
                </div>
                <button class="btn btn-primary read-more" data-id="${article.id}">Read More</button>
            </div>
        `

    newsContainer.appendChild(articleElement)

    // Add event listener to the read more button
    articleElement.querySelector(".read-more").addEventListener("click", () => {
      showArticle(article.id)
    })
  })
}

// Show a specific article
function showArticle(id) {
  currentArticle = articles.find((article) => article.id === id)

  if (!currentArticle) return

  // Update article page with current article data
  document.getElementById("article-category").textContent = currentArticle.category
  document.getElementById("article-date").textContent = formatDate(currentArticle.date)
  document.getElementById("article-title").textContent = currentArticle.title
  document.getElementById("article-author").textContent = currentArticle.author
  document.getElementById("article-image").src = currentArticle.image
  document.getElementById("article-body").innerHTML = currentArticle.content
  document.getElementById("like-count").textContent = currentArticle.likes
  document.getElementById("dislike-count").textContent = currentArticle.dislikes

  // Load comments for this article
  renderComments()

  // Show article page
  showPage("article")
}

// Update an article in the articles list
function updateArticleInList(updatedArticle) {
  const index = articles.findIndex((article) => article.id === updatedArticle.id)
  if (index !== -1) {
    articles[index] = updatedArticle
  }
}

// Render comments for the current article
function renderComments() {
  if (!currentArticle) return

  const articleComments = comments.filter((comment) => comment.articleId === currentArticle.id)

  document.getElementById("comment-count").textContent = articleComments.length

  commentsContainer.innerHTML = ""

  if (articleComments.length === 0) {
    commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>'
    return
  }

  articleComments.forEach((comment) => {
    const commentElement = document.createElement("div")
    commentElement.className = "comment"
    commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <div class="comment-content">
                <p>${comment.content}</p>
            </div>
        `

    commentsContainer.appendChild(commentElement)
  })
}

// Format date to a more readable format
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", init)

