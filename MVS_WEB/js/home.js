/**
 * ==============================================================================
 * ไฟล์: js/home.js
 * วัตถุประสงค์: นำข้อมูลจาก data/*.js มาแสดงผลบนหน้าแรก (index.html)
 * ==============================================================================
 * 
 * [หลักการทำงานตามข้อกำหนดทางเทคนิค]
 * 1. แสดงผลข้อความทั้งหมดด้วย .textContent เพื่อความปลอดภัย ไม่ใช้ innerHTML กับข้อมูล
 * 2. จัดการส่วนปฏิทิน Google Calendar: ถ้าครูยังไม่ได้ใส่ URL ให้ซ่อนส่วนนี้อัตโนมัติ
 * 3. ดึงข่าวสาร 3-4 ข่าวล่าสุด เรียงจากใหม่ไปเก่า
 * ==============================================================================
 */

(function () {
  'use strict';

  function createElement(tag, className, textContent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent !== undefined && textContent !== null) el.textContent = textContent;
    return el;
  }

  function initHomePage() {
    const site = window.MVS_SITE;
    const programs = window.MVS_PROGRAMS || [];
    const news = window.MVS_NEWS || [];

    if (!site) return;

    // --------------------------------------------------------------------------
    // 1. ส่วนหัวเด่น (Hero Section)
    // --------------------------------------------------------------------------
    const heroInstName = document.getElementById('hero-inst-name');
    if (heroInstName) heroInstName.textContent = site.nameTh + ' (' + site.nameEn + ')';

    const heroInstCn = document.getElementById('hero-inst-cn');
    if (heroInstCn && site.nameCn) heroInstCn.textContent = site.nameCn;

    const heroInstDesc = document.getElementById('hero-inst-desc');
    if (heroInstDesc) heroInstDesc.textContent = '• ' + site.type;

    // คำขวัญสามวรรค แยกบรรทัด
    const mottoContainer = document.getElementById('hero-motto');
    if (mottoContainer && Array.isArray(site.motto)) {
      mottoContainer.textContent = '';
      site.motto.forEach(function (lineText) {
        const span = createElement('span', 'hero-motto-line', lineText);
        mottoContainer.appendChild(span);
      });
    }

    const heroSubtext = document.getElementById('hero-subtext');
    if (heroSubtext) heroSubtext.textContent = site.description;

    const heroApplyBtn = document.getElementById('hero-apply-btn');
    if (heroApplyBtn) {
      heroApplyBtn.href = site.applyOnlineUrl;
      heroApplyBtn.target = '_blank';
      heroApplyBtn.rel = 'noopener noreferrer';
    }

    // --------------------------------------------------------------------------
    // 2. จุดเด่น 3 ข้อ (Highlights)
    // --------------------------------------------------------------------------
    const highlightsContainer = document.getElementById('highlights-list');
    if (highlightsContainer && Array.isArray(site.highlights)) {
      highlightsContainer.textContent = '';
      site.highlights.forEach(function (item) {
        const card = createElement('div', 'highlight-item');
        const title = createElement('h3', 'highlight-title', item.title);
        const desc = createElement('p', 'highlight-desc', item.desc);
        card.appendChild(title);
        card.appendChild(desc);
        highlightsContainer.appendChild(card);
      });
    }

    // --------------------------------------------------------------------------
    // 3. สาขาวิชา 5 สาขา (Programs)
    // --------------------------------------------------------------------------
    const programsContainer = document.getElementById('programs-list');
    if (programsContainer && Array.isArray(programs)) {
      programsContainer.textContent = '';
      programs.forEach(function (prog) {
        const a = createElement('a', 'program-row');
        a.href = 'program.html?id=' + encodeURIComponent(prog.id);

        const colLeft = createElement('div');
        const title = createElement('h3', 'program-row-title', prog.name);
        const levels = createElement('div', 'program-row-levels', prog.levels);
        colLeft.appendChild(title);
        colLeft.appendChild(levels);

        const colMid = createElement('div');
        const summary = createElement('p', 'program-row-summary', prog.summary);
        colMid.appendChild(summary);

        const colRight = createElement('div', 'program-row-action', 'รายละเอียดหลักสูตร');

        a.appendChild(colLeft);
        a.appendChild(colMid);
        a.appendChild(colRight);

        programsContainer.appendChild(a);
      });
    }

    // --------------------------------------------------------------------------
    // 4. ข่าวและประกาศล่าสุด (News) - ดึง 3-4 รายการล่าสุด
    // --------------------------------------------------------------------------
    const newsContainer = document.getElementById('news-list');
    if (newsContainer && Array.isArray(news)) {
      newsContainer.textContent = '';
      // แสดงสูงสุด 4 ข่าว
      const latestNews = news.slice(0, 4);
      latestNews.forEach(function (item) {
        const card = createElement('a', 'news-card');
        card.href = item.link || 'news.html';

        const meta = createElement('div', 'news-meta');
        const cat = createElement('span', 'news-category', item.category);
        const date = createElement('span', null, item.dateDisplay || item.date);
        meta.appendChild(cat);
        meta.appendChild(date);

        const title = createElement('h3', 'news-card-title', item.title);
        const summary = createElement('p', 'news-card-summary', item.summary);

        card.appendChild(meta);
        card.appendChild(title);
        card.appendChild(summary);

        newsContainer.appendChild(card);
      });
    }

    const newsFbLink = document.getElementById('news-fb-link');
    if (newsFbLink && site.facebookUrl) {
      newsFbLink.href = site.facebookUrl;
      newsFbLink.target = '_blank';
      newsFbLink.rel = 'noopener noreferrer';
    }

    // --------------------------------------------------------------------------
    // 5. ขั้นตอนการสมัคร (Admission Steps)
    // --------------------------------------------------------------------------
    const stepsContainer = document.getElementById('steps-list');
    if (stepsContainer && Array.isArray(site.admissionSteps)) {
      stepsContainer.textContent = '';
      site.admissionSteps.forEach(function (step) {
        const card = createElement('div', 'step-card');
        const num = createElement('div', 'step-number', step.step);
        const title = createElement('h3', 'step-title', step.title);
        const desc = createElement('p', 'step-desc', step.desc);

        card.appendChild(num);
        card.appendChild(title);
        card.appendChild(desc);

        stepsContainer.appendChild(card);
      });
    }

    // --------------------------------------------------------------------------
    // 6. ปฏิทินกิจกรรม Google Calendar (ซ่อนถ้ายังไม่มี URL)
    // --------------------------------------------------------------------------
    const calendarSection = document.getElementById('calendar-section');
    const calendarIframe = document.getElementById('calendar-iframe');

    if (calendarSection && calendarIframe) {
      if (site.googleCalendarUrl && site.googleCalendarUrl.trim() !== '') {
        calendarIframe.src = site.googleCalendarUrl.trim();
        calendarSection.classList.add('is-visible');
      } else {
        // หากยังไม่ได้ใส่ลิงก์ ให้ซ่อนไว้เรียบร้อย
        calendarSection.classList.remove('is-visible');
      }
    }

    // --------------------------------------------------------------------------
    // 7. ส่วนติดต่อ (Contact Section)
    // --------------------------------------------------------------------------
    const contactAddress = document.getElementById('contact-address');
    if (contactAddress) contactAddress.textContent = site.address;

    const contactPhones = document.getElementById('contact-phones');
    if (contactPhones && Array.isArray(site.phones)) {
      contactPhones.textContent = site.phones.join(' หรือ ');
    }

    const contactEmail = document.getElementById('contact-email');
    if (contactEmail && site.email) {
      contactEmail.textContent = site.email;
      contactEmail.href = 'mailto:' + site.email;
    }

    const contactFbBtn = document.getElementById('contact-fb-btn');
    if (contactFbBtn && site.facebookUrl) {
      contactFbBtn.href = site.facebookUrl;
      contactFbBtn.target = '_blank';
      contactFbBtn.rel = 'noopener noreferrer';
    }

    const contactApplyBtn = document.getElementById('contact-apply-btn');
    if (contactApplyBtn && site.applyOnlineUrl) {
      contactApplyBtn.href = site.applyOnlineUrl;
      contactApplyBtn.target = '_blank';
      contactApplyBtn.rel = 'noopener noreferrer';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
  } else {
    initHomePage();
  }
})();
