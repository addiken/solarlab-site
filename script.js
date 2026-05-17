const applyNonBreakingShortWords = () => {
  const excludedTags = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT"]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;

      if (!parent || excludedTags.has(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      return /\S/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    node.nodeValue = node.nodeValue.replace(
      /(^|[\s([{«„"'])((?:[A-Za-zА-Яа-яЁё0-9]{1,3}|[A-Za-zА-Яа-яЁё0-9]{1,3}[.,:;!?]))\s+/g,
      "$1$2\u00a0",
    );
  });
};

const setupHeader = () => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");

  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();
};

const setupReveal = () => {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  elements.forEach((element) => observer.observe(element));
};

const setupForm = () => {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = new FormData(form).get("message")?.toString().trim();

    if (!message) {
      status.textContent = "Пожалуйста, заполните поле перед\u00a0отправкой.";
      return;
    }

    status.textContent = "Спасибо. Сообщение подготовлено, мы\u00a0свяжемся с\u00a0вами по\u00a0указанным контактам.";
    form.reset();
  });
};

applyNonBreakingShortWords();
setupHeader();
setupReveal();
setupForm();
