/**
 * ==============================================================================
 * ไฟล์: js/layout.js
 * วัตถุประสงค์: สร้างส่วนหัว (Header) และส่วนท้าย (Footer) ร่วมกันทุกหน้า
 * ==============================================================================
 * 
 * [หลักการทำงานตามข้อกำหนดทางเทคนิค]
 * 1. อ่านข้อมูลจาก window.MVS_SITE (จาก data/site.js) และ window.MVS_EXTERNAL_LINKS (จาก data/links.js)
 * 2. ปลอดภัยสูงสุด: แสดงข้อความทั้งหมดด้วย .textContent ห้ามใช้ innerHTML กับข้อมูลจาก data
 * 3. มีสคริปต์ควบคุมเมนูมือถือ รองรับการกดคีย์บอร์ด (Esc) และมาตรฐาน Accessibility (ARIA)
 * ==============================================================================
 */

(function () {
  'use strict';

  // ตรวจสอบว่ามีข้อมูล site data หรือไม่
  if (!window.MVS_SITE) {
    console.error('ไม่พบข้อมูล MVS_SITE กรุณาตรวจสอบว่าได้โหลด data/site.js ก่อน layout.js หรือไม่');
    return;
  }

  const site = window.MVS_SITE;
  const externalLinks = window.MVS_EXTERNAL_LINKS || [];

  // ดึงชื่อไฟล์ปัจจุบันเพื่อไฮไลต์เมนูที่เลือกอยู่
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  /**
   * ฟังก์ชันสร้าง DOM Element แบบปลอดภัยและสะดวก
   */
  function createElement(tag, className, textContent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent !== undefined && textContent !== null) el.textContent = textContent;
    return el;
  }

  /**
   * 1. สร้างส่วนหัว (Header)
   */
  function renderHeader() {
    const headerContainer = document.getElementById('site-header');
    if (!headerContainer) return;

    // ล้างเนื้อหาเดิม (ถ้ามี)
    headerContainer.textContent = '';

    // --- แถบ Utility Bar ด้านบนสุด ---
    const utilityBar = createElement('div', 'utility-bar');
    const utilityInner = createElement('div', 'container utility-bar-inner');

    if (Array.isArray(site.quickLinks)) {
      site.quickLinks.forEach(function (item) {
        const a = createElement('a', 'utility-link', item.label);
        a.href = item.href;
        if (item.external) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        utilityInner.appendChild(a);
      });
    }
    utilityBar.appendChild(utilityInner);

    // --- แถบ Header หลัก ---
    const header = createElement('header', 'site-header');
    const headerInner = createElement('div', 'container header-inner');

    // ส่วนแบรนด์ (โลโก้ + ชื่อวิทยาลัย)
    const brand = createElement('a', 'brand');
    brand.href = 'index.html';
    brand.setAttribute('aria-label', site.nameTh + ' หน้าแรก');

    const logoImg = createElement('img', 'brand-logo');
    logoImg.src = 'img/logo.png';
    logoImg.alt = 'ตราสัญลักษณ์ ' + site.nameTh;
    logoImg.width = 44;
    logoImg.height = 44;

    const brandText = createElement('div', 'brand-text');
    const nameTh = createElement('span', 'brand-name-th', site.nameTh);
    const nameSub = createElement('span', 'brand-name-sub', site.nameEn);

    brandText.appendChild(nameTh);
    brandText.appendChild(nameSub);

    brand.appendChild(logoImg);
    brand.appendChild(brandText);

    // เมนูหลักสำหรับจอคอมพิวเตอร์ (Desktop Nav)
    const nav = createElement('nav', 'nav-desktop');
    nav.setAttribute('aria-label', 'เมนูหลัก');

    const navList = createElement('ul', 'nav-menu');

    if (Array.isArray(site.mainMenu)) {
      site.mainMenu.forEach(function (item) {
        const li = createElement('li');
        const a = createElement('a', 'nav-link', item.label);
        a.href = item.href;

        // ไฮไลต์ถ้าเป็นหน้าปัจจุบัน
        if (currentPage === item.href) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }

        li.appendChild(a);
        navList.appendChild(li);
      });
    }

    // ปุ่มสมัครเรียนในเมนู (เด่นขึ้นมาเล็กน้อย)
    const ctaLi = createElement('li', 'nav-cta-item');
    const ctaBtn = createElement('a', 'btn btn-primary btn-sm', 'สมัครเรียน');
    ctaBtn.href = site.applyOnlineUrl;
    ctaBtn.target = '_blank';
    ctaBtn.rel = 'noopener noreferrer';
    ctaLi.appendChild(ctaBtn);
    navList.appendChild(ctaLi);

    nav.appendChild(navList);

    // ปุ่มเปิดเมนูมือถือ (Hamburger Button)
    const menuBtn = createElement('button', 'menu-toggle');
    menuBtn.id = 'menu-toggle-btn';
    menuBtn.setAttribute('aria-label', 'เปิดเมนูนำทาง');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-controls', 'mobile-drawer');

    // SVG ไอคอน Hamburger
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'menu-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    const line1 = document.createElementNS(svgNS, 'line');
    line1.setAttribute('x1', '3');
    line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '21');
    line1.setAttribute('y2', '6');

    const line2 = document.createElementNS(svgNS, 'line');
    line2.setAttribute('x1', '3');
    line2.setAttribute('y1', '12');
    line2.setAttribute('x2', '21');
    line2.setAttribute('y2', '12');

    const line3 = document.createElementNS(svgNS, 'line');
    line3.setAttribute('x1', '3');
    line3.setAttribute('y1', '18');
    line3.setAttribute('x2', '21');
    line3.setAttribute('y2', '18');

    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(line3);
    menuBtn.appendChild(svg);

    headerInner.appendChild(brand);
    headerInner.appendChild(nav);
    headerInner.appendChild(menuBtn);
    header.appendChild(headerInner);

    // --- แผงเมนูมือถือ (Mobile Drawer) ---
    const mobileOverlay = createElement('div', 'mobile-menu-overlay');
    mobileOverlay.id = 'mobile-menu-overlay';

    const mobileDrawer = createElement('div', 'mobile-menu-drawer');
    mobileDrawer.id = 'mobile-drawer';
    mobileDrawer.setAttribute('role', 'dialog');
    mobileDrawer.setAttribute('aria-modal', 'true');
    mobileDrawer.setAttribute('aria-label', 'เมนูนำทางบนมือถือ');

    const drawerHeader = createElement('div', 'mobile-menu-header');
    const drawerTitle = createElement('div', 'mobile-menu-title', site.nameTh);
    const closeBtn = createElement('button', 'mobile-menu-close');
    closeBtn.id = 'mobile-menu-close-btn';
    closeBtn.setAttribute('aria-label', 'ปิดเมนู');

    // SVG กากบาท
    const closeSvg = document.createElementNS(svgNS, 'svg');
    closeSvg.setAttribute('width', '20');
    closeSvg.setAttribute('height', '20');
    closeSvg.setAttribute('viewBox', '0 0 24 24');
    closeSvg.setAttribute('fill', 'none');
    closeSvg.setAttribute('stroke', 'currentColor');
    closeSvg.setAttribute('stroke-width', '2');
    closeSvg.setAttribute('stroke-linecap', 'round');
    closeSvg.setAttribute('stroke-linejoin', 'round');

    const cLine1 = document.createElementNS(svgNS, 'line');
    cLine1.setAttribute('x1', '18');
    cLine1.setAttribute('y1', '6');
    cLine1.setAttribute('x2', '6');
    cLine1.setAttribute('y2', '18');

    const cLine2 = document.createElementNS(svgNS, 'line');
    cLine2.setAttribute('x1', '6');
    cLine2.setAttribute('y1', '6');
    cLine2.setAttribute('x2', '18');
    cLine2.setAttribute('y2', '18');

    closeSvg.appendChild(cLine1);
    closeSvg.appendChild(cLine2);
    closeBtn.appendChild(closeSvg);

    drawerHeader.appendChild(drawerTitle);
    drawerHeader.appendChild(closeBtn);
    mobileDrawer.appendChild(drawerHeader);

    const mobileNavList = createElement('ul', 'mobile-nav-list');
    if (Array.isArray(site.mainMenu)) {
      site.mainMenu.forEach(function (item) {
        const li = createElement('li');
        const a = createElement('a', 'mobile-nav-link', item.label);
        a.href = item.href;
        if (currentPage === item.href) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }
        li.appendChild(a);
        mobileNavList.appendChild(li);
      });
    }

    // ปุ่มสมัครเรียนบนมือถือ
    const mApplyLi = createElement('li');
    mApplyLi.style.marginTop = '0.75rem';
    const mApplyBtn = createElement('a', 'btn btn-primary', 'สมัครเรียนออนไลน์');
    mApplyBtn.style.width = '100%';
    mApplyBtn.href = site.applyOnlineUrl;
    mApplyBtn.target = '_blank';
    mApplyBtn.rel = 'noopener noreferrer';
    mApplyLi.appendChild(mApplyBtn);
    mobileNavList.appendChild(mApplyLi);

    mobileDrawer.appendChild(mobileNavList);

    // ลิงก์ลัดระบบงานในเมนูมือถือ
    if (Array.isArray(site.quickLinks) && site.quickLinks.length > 0) {
      const divider = createElement('div', 'mobile-utility-divider');
      const utilityTitle = createElement('div', 'contact-label', 'ระบบสารสนเทศ');
      utilityTitle.style.marginBottom = '0.5rem';
      utilityTitle.style.paddingLeft = '0.85rem';

      const mUtilityList = createElement('ul', 'mobile-utility-list');
      site.quickLinks.forEach(function (item) {
        const li = createElement('li');
        const a = createElement('a', 'mobile-utility-link', item.label);
        a.href = item.href;
        if (item.external) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        li.appendChild(a);
        mUtilityList.appendChild(li);
      });

      mobileDrawer.appendChild(divider);
      mobileDrawer.appendChild(utilityTitle);
      mobileDrawer.appendChild(mUtilityList);
    }

    mobileOverlay.appendChild(mobileDrawer);

    // ประกอบร่างใส่ใน DOM
    headerContainer.appendChild(utilityBar);
    headerContainer.appendChild(header);
    headerContainer.appendChild(mobileOverlay);

    // ผูก Event เมนูมือถือ
    initMobileMenu(menuBtn, closeBtn, mobileOverlay);
  }

  /**
   * ควบคุมการเปิด-ปิดเมนูบนมือถือ (Accessibility & Keyboard friendly)
   */
  function initMobileMenu(toggleBtn, closeBtn, overlay) {
    if (!toggleBtn || !overlay) return;

    function openMenu() {
      overlay.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      overlay.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggleBtn.focus();
    }

    toggleBtn.addEventListener('click', function () {
      const isOpen = overlay.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // คลิกพื้นหลัง overlay เพื่อปิด
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });

    // ปิดด้วยปุ่ม Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /**
   * 2. สร้างส่วนท้าย (Footer)
   */
  function renderFooter() {
    const footerContainer = document.getElementById('site-footer');
    if (!footerContainer) return;

    footerContainer.textContent = '';

    const footer = createElement('footer', 'site-footer');
    const container = createElement('div', 'container');

    // --- ส่วนบนของ Footer (3 คอลัมน์) ---
    const footerTop = createElement('div', 'footer-top');
    const footerGrid = createElement('div', 'footer-grid');

    // คอลัมน์ที่ 1: ข้อมูลวิทยาลัย
    const col1 = createElement('div');
    const col1Title = createElement('div', 'footer-col-title', site.nameTh);
    const col1Desc = createElement('p', 'footer-about-text', site.type);
    const col1Address = createElement('p', 'footer-about-text', site.address);

    col1.appendChild(col1Title);
    col1.appendChild(col1Desc);
    col1.appendChild(col1Address);

    // คอลัมน์ที่ 2: เมนูลัด
    const col2 = createElement('div');
    const col2Title = createElement('div', 'footer-col-title', 'เมนูเว็บไซต์');
    const col2List = createElement('ul', 'footer-links-list');

    if (Array.isArray(site.mainMenu)) {
      site.mainMenu.forEach(function (item) {
        const li = createElement('li');
        const a = createElement('a', 'footer-link', item.label);
        a.href = item.href;
        li.appendChild(a);
        col2List.appendChild(li);
      });
    }
    col2.appendChild(col2Title);
    col2.appendChild(col2List);

    // คอลัมน์ที่ 3: ช่องทางติดต่อและระบบงาน
    const col3 = createElement('div');
    const col3Title = createElement('div', 'footer-col-title', 'ติดต่อและระบบงาน');
    const col3List = createElement('ul', 'footer-links-list');

    // เบอร์โทร
    if (Array.isArray(site.phones) && site.phones.length > 0) {
      const liPhone = createElement('li');
      const phoneText = 'โทร: ' + site.phones.join(' หรือ ');
      liPhone.textContent = phoneText;
      col3List.appendChild(liPhone);
    }

    // อีเมล
    if (site.email) {
      const liEmail = createElement('li');
      liEmail.textContent = 'อีเมล: ' + site.email;
      col3List.appendChild(liEmail);
    }

    // Facebook
    if (site.facebookUrl) {
      const liFb = createElement('li');
      const fbLink = createElement('a', 'footer-link', 'Facebook: ' + (site.facebookTitle || 'วิทยาลัยอาชีวศึกษาแม่สาย'));
      fbLink.href = site.facebookUrl;
      fbLink.target = '_blank';
      fbLink.rel = 'noopener noreferrer';
      liFb.appendChild(fbLink);
      col3List.appendChild(liFb);
    }

    // ระบบรับสมัคร SISA
    const liSisa = createElement('li');
    const sisaLink = createElement('a', 'footer-link', 'ระบบรับสมัครเรียนออนไลน์ (SISA)');
    sisaLink.href = site.applyOnlineUrl;
    sisaLink.target = '_blank';
    sisaLink.rel = 'noopener noreferrer';
    liSisa.appendChild(sisaLink);
    col3List.appendChild(liSisa);

    col3.appendChild(col3Title);
    col3.appendChild(col3List);

    footerGrid.appendChild(col1);
    footerGrid.appendChild(col2);
    footerGrid.appendChild(col3);
    footerTop.appendChild(footerGrid);

    // --- ส่วนแสดงลิงก์หน่วยงานภายนอก (Plain Text List ตามข้อกำหนด) ---
    const extSection = createElement('div', 'external-links-section');
    const extTitle = createElement('div', 'external-links-title', 'หน่วยงานและองค์กรที่เกี่ยวข้อง');
    const extCloud = createElement('div', 'external-links-cloud');

    if (Array.isArray(externalLinks) && externalLinks.length > 0) {
      externalLinks.forEach(function (item) {
        const a = createElement('a', 'external-link-item', item.name);
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        if (item.description) {
          a.title = item.description;
        }
        extCloud.appendChild(a);
      });
    }

    extSection.appendChild(extTitle);
    extSection.appendChild(extCloud);

    // --- แถบลิขสิทธิ์ด้านล่างสุด ---
    const footerBottom = createElement('div', 'footer-bottom');
    const currentYear = new Date().getFullYear();
    const copyrightText = createElement('div', null, '© ' + currentYear + ' ' + site.nameTh + ' (' + site.nameEn + ') สงวนลิขสิทธิ์');
    const mottoMini = createElement('div', null, site.motto.join(' • '));

    footerBottom.appendChild(copyrightText);
    footerBottom.appendChild(mottoMini);

    // ประกอบโครงสร้างเข้า Footer
    container.appendChild(footerTop);
    container.appendChild(extSection);
    container.appendChild(footerBottom);
    footer.appendChild(container);

    footerContainer.appendChild(footer);
  }

  // เรียกทำงานเมื่อโหลดเอกสารเสร็จ
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      renderHeader();
      renderFooter();
    });
  } else {
    renderHeader();
    renderFooter();
  }
})();
