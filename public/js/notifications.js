(function () {
  "use strict";

  let hasFetched = false;
  let isOpen = false;
  let pollingId = null;
  let handlersBound = false;

  const getElements = () => ({
    bellBtn: document.getElementById("bell-toggle"),
    badge: document.getElementById("bell-badge"),
    dropdown: document.getElementById("notifications-dropdown"),
    avatarBtn: document.getElementById("avatar-toggle"),
    profileDropdown: document.getElementById("profile-dropdown"),
  });

  function getBasePath() {
    const path = window.location.pathname || "";
    if (path.includes("/src/actions/")) {
      return "../../";
    }
    if (path.includes("/pages/") || path.includes("/auth/")) {
      return "../";
    }
    return "";
  }

  async function fetchNotifications() {
    const { badge, dropdown } = getElements();
    if (!dropdown) {
      return;
    }
    try {
      const basePath = getBasePath();
      const response = await fetch(`${basePath}src/actions/notifications.php?action=fetch`, {
        credentials: "same-origin",
      });
      if (response.ok) {
        const data = await response.json();
        const unread = Array.isArray(data.unread) ? data.unread : [];
        const read = Array.isArray(data.read) ? data.read : [];

        if (data.unread_count > 0 && badge) {
          badge.style.display = "flex";
          badge.textContent = data.unread_count > 99 ? "99+" : data.unread_count;
        } else if (badge) {
          badge.style.display = "none";
        }

        dropdown.innerHTML = "";

        if (unread.length === 0 && read.length === 0) {
          dropdown.innerHTML = '<div class="dropdown-empty">Não há mensagens no momento.</div>';
          return;
        }

        if (unread.length > 0) {
          const unreadLabel = document.createElement("div");
          unreadLabel.className = "dropdown-section-title";
          unreadLabel.textContent = "Novas";
          dropdown.appendChild(unreadLabel);

          unread.forEach((n) => {
            const item = document.createElement("a");
            item.href = `${basePath}pages/post_view.php?id=${n.post_id}`;
            item.className = "dropdown-item unread";
            item.textContent = n.message;
            dropdown.appendChild(item);
          });
        }

        if (read.length > 0) {
          const readLabel = document.createElement("div");
          readLabel.className = "dropdown-section-title";
          readLabel.textContent = "Visualizadas";
          dropdown.appendChild(readLabel);

          read.forEach((n) => {
            const item = document.createElement("a");
            item.href = `${basePath}pages/post_view.php?id=${n.post_id}`;
            item.className = "dropdown-item";
            item.textContent = n.message;
            dropdown.appendChild(item);
          });

          const clearBtn = document.createElement("button");
          clearBtn.type = "button";
          clearBtn.className = "dropdown-clear";
          clearBtn.textContent = "Limpar visualizadas";
          clearBtn.addEventListener("click", async () => {
            await clearReadNotifications();
            fetchNotifications();
          });
          dropdown.appendChild(clearBtn);
        }
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  }

  async function markAsRead() {
    const { badge } = getElements();
    try {
      const basePath = getBasePath();
      const formData = new FormData();
      const tokenMeta = document.querySelector('meta[name="_csrf"]');
      if (tokenMeta) {
        formData.append("_csrf", tokenMeta.getAttribute("content"));
      }
      await fetch(`${basePath}src/actions/notifications.php?action=read_all`, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      if (badge) badge.style.display = "none";
    } catch (e) {
      console.error(e);
    }
  }

  async function clearReadNotifications() {
    try {
      const basePath = getBasePath();
      const formData = new FormData();
      const tokenMeta = document.querySelector('meta[name="_csrf"]');
      if (tokenMeta) {
        formData.append("_csrf", tokenMeta.getAttribute("content"));
      }
      await fetch(`${basePath}src/actions/notifications.php?action=clear_read`, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
    } catch (e) {
      console.error(e);
    }
  }

  function ensureHandlers() {
    if (handlersBound) {
      return;
    }
    handlersBound = true;

    document.addEventListener("click", (e) => {
      const bellTrigger = e.target.closest("#bell-toggle");
      const avatarTrigger = e.target.closest("#avatar-toggle");
      const { bellBtn, dropdown, avatarBtn, profileDropdown } = getElements();

        if (bellTrigger) {
          e.stopPropagation();
          if (!bellBtn || !dropdown) {
            return;
          }
          positionDropdown(bellBtn, dropdown);
          bellBtn.classList.add("bell-shake");
        setTimeout(() => {
          bellBtn.classList.remove("bell-shake");
        }, 500);

        isOpen = !isOpen;
        dropdown.classList.toggle("is-open", isOpen);

        if (isOpen) {
          if (profileDropdown && profileDropdown.classList.contains("is-open")) {
            profileDropdown.classList.remove("is-open");
          }

          if (!hasFetched) {
            dropdown.innerHTML = '<div class="dropdown-empty">Carregando...</div>';
            fetchNotifications().then(async () => {
              await markAsRead();
              fetchNotifications();
            });
            hasFetched = true;
          } else {
            markAsRead().then(fetchNotifications);
          }
        }
        return;
      }

      if (avatarTrigger) {
        e.stopPropagation();
        if (!profileDropdown) {
          return;
        }
        const pIsOpen = profileDropdown.classList.contains("is-open");
        profileDropdown.classList.toggle("is-open", !pIsOpen);
        if (!pIsOpen && isOpen && dropdown) {
          dropdown.classList.remove("is-open");
          isOpen = false;
        }
        return;
      }

      if (isOpen && dropdown && bellBtn && !dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.classList.remove("is-open");
        isOpen = false;
      }

      if (
        profileDropdown &&
        profileDropdown.classList.contains("is-open") &&
        avatarBtn &&
        !profileDropdown.contains(e.target) &&
        !avatarBtn.contains(e.target)
      ) {
        profileDropdown.classList.remove("is-open");
      }
    });
  }

  function positionDropdown(bellBtn, dropdown) {
    const rect = bellBtn.getBoundingClientRect();
    const dropdownWidth = dropdown.offsetWidth || 320;
    const padding = 12;
    let left = rect.right + 12;
    if (left + dropdownWidth > window.innerWidth - padding) {
      left = Math.max(padding, rect.left - dropdownWidth - 12);
    }
    const top = Math.min(Math.max(rect.top, padding), window.innerHeight - padding);
    dropdown.style.position = "fixed";
    dropdown.style.left = `${left}px`;
    dropdown.style.top = `${top}px`;
    dropdown.style.right = "auto";
  }

  function initNotifications() {
    const { bellBtn, dropdown } = getElements();
    if (!bellBtn || !dropdown) {
      return;
    }

    ensureHandlers();
    hasFetched = false;
    isOpen = false;

    if (!pollingId) {
      pollingId = setInterval(fetchNotifications, 30000);
    }

    fetchNotifications();
  }

  window.initNotifications = initNotifications;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNotifications, { once: true });
  } else {
    initNotifications();
  }
})();
