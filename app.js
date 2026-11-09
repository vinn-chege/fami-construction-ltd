// Fami Construction Limited — Interactive Frontend Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Mobile Navigation
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // 2. Service Category Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  const serviceCards = document.querySelectorAll('.service-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-filter');
      serviceCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (target === 'all' || cat === target) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Interactive Kenyan Property Staffing & SLA Configurator (Direct User Headcount Input)
  const propTypeButtons = document.querySelectorAll('#propTypeGroup .option-pill');
  const inputCleaners = document.getElementById('inputCleaners');
  const inputDayGuards = document.getElementById('inputDayGuards');
  const inputNightGuards = document.getElementById('inputNightGuards');
  const inputTechs = document.getElementById('inputTechs');
  const unitCountInput = document.getElementById('unitCountInput');
  const unitLabelTitle = document.getElementById('unitLabelTitle');
  const autoSuggestBtn = document.getElementById('autoSuggestBtn');
  const totalHeadcountBadge = document.getElementById('totalHeadcountBadge');
  const zoneSelect = document.getElementById('zoneSelect');
  const extraServiceSelect = document.getElementById('extraServiceSelect');

  const outPlanTitle = document.getElementById('outPlanTitle');
  const outPlanSub = document.getElementById('outPlanSub');
  const outCleaners = document.getElementById('outCleaners');
  const outGuards = document.getElementById('outGuards');
  const outTech = document.getElementById('outTech');
  const outSla = document.getElementById('outSla');
  const outChecklist = document.getElementById('outChecklist');

  let currentPropType = 'residential';

  const propTypeMeta = {
    residential: {
      title: 'Integrated Residential Estate FM Blueprint',
      unitLabel: '3. Property Size (Number of Residential Units / Houses)',
      unitSuffix: 'Units',
      cleanerRatio: 22,
      guardRatio: 40
    },
    commercial: {
      title: 'Grade-A Commercial Tower FM Blueprint',
      unitLabel: '3. Property Size (Number of Office Suites / Floors)',
      unitSuffix: 'Suites / Floors',
      cleanerRatio: 16,
      guardRatio: 30
    },
    mixed: {
      title: 'Retail Mall & Mixed-Use Operations Blueprint',
      unitLabel: '3. Property Size (Number of Retail Outlets / Units)',
      unitSuffix: 'Outlets / Units',
      cleanerRatio: 14,
      guardRatio: 25
    },
    industrial: {
      title: 'Industrial Park & Godown Operations Blueprint',
      unitLabel: '3. Property Size (Number of Godowns / Operational Bays)',
      unitSuffix: 'Godowns / Bays',
      cleanerRatio: 25,
      guardRatio: 28
    }
  };

  function clampInt(val, min, max) {
    const n = parseInt(val, 10);
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function autoSuggestForSize() {
    const meta = propTypeMeta[currentPropType];
    const units = clampInt(unitCountInput.value, 1, 5000);
    unitCountInput.value = units;

    inputCleaners.value = Math.max(1, Math.ceil(units / meta.cleanerRatio));
    inputDayGuards.value = Math.max(1, Math.ceil(units / meta.guardRatio));
    inputNightGuards.value = Math.max(2, Math.ceil((units * 1.15) / meta.guardRatio));
    inputTechs.value = units >= 80 ? 2 : 1;

    computeEstimator();
  }

  function computeEstimator() {
    const meta = propTypeMeta[currentPropType];
    const cleaners = clampInt(inputCleaners.value, 0, 500);
    const dayGuards = clampInt(inputDayGuards.value, 0, 500);
    const nightGuards = clampInt(inputNightGuards.value, 0, 500);
    const techs = clampInt(inputTechs.value, 0, 200);
    const units = clampInt(unitCountInput.value, 1, 5000);
    const zone = zoneSelect.value;
    const extraScope = extraServiceSelect ? extraServiceSelect.value : '';

    const totalGuards = dayGuards + nightGuards;
    const totalStaff = cleaners + totalGuards + techs;

    unitLabelTitle.textContent = meta.unitLabel;
    totalHeadcountBadge.textContent = `Total: ${totalStaff} Personnel`;

    outPlanTitle.textContent = meta.title;
    outPlanSub.textContent = `${totalStaff} Total Personnel • ${units} ${meta.unitSuffix} in ${zone}`;

    // Cleaners Output
    if (cleaners > 0) {
      outCleaners.textContent = `${cleaners} Steward${cleaners > 1 ? 's' : ''}`;
    } else {
      outCleaners.textContent = '0 (Not Requested)';
    }

    // Security Officers Output
    if (totalGuards > 0) {
      outGuards.textContent = `${dayGuards} Day / ${nightGuards} Night`;
    } else {
      outGuards.textContent = '0 (Not Requested)';
    }

    // Technical Maintenance Output
    if (techs > 0) {
      outTech.textContent = `${techs} Resident Tech${techs > 1 ? 's' : ''}`;
    } else {
      outTech.textContent = 'On-Call SLA Only';
    }

    // SLA Response by Zone
    if (zone.includes('Westlands')) {
      outSla.textContent = '< 45 Mins (HQ Zone)';
    } else if (zone.includes('Kilimani') || zone.includes('Upper Hill') || zone.includes('Karen')) {
      outSla.textContent = '< 60 Mins Dispatch';
    } else if (zone.includes('Other')) {
      outSla.textContent = 'Regional Team SLA';
    } else {
      outSla.textContent = '< 90 Mins Nairobi SLA';
    }

    // Summary Checklist
    const items = [
      ['Total Requested Headcount', `${totalStaff} Vetted Personnel`],
      [
        'Role Breakdown',
        `${cleaners} Cleaner${cleaners !== 1 ? 's' : ''}, ${totalGuards} Guard${totalGuards !== 1 ? 's' : ''}, ${techs} Tech${techs !== 1 ? 's' : ''}`
      ],
      ['Zero Reliever Gaps (Westlands Pool)', 'Guaranteed Shift Cover'],
      ['Statutory Compliance (NSSF, SHIF, WIBA, DCI)', '100% Covered'],
      ['Additional Project Scope', extraScope.split('(')[0].trim()]
    ];

    outChecklist.innerHTML = items
      .map(([label, badge]) => `<li><span>${label}</span><strong>${badge}</strong></li>`)
      .join('');

    const staffBreakdownText = `${cleaners} Cleaners, ${dayGuards} Day Guards, ${nightGuards} Night Guards, ${techs} Maintenance Techs (Total: ${totalStaff} People)`;

    return {
      propTypeLabel: meta.title,
      unitsText: `${units} ${meta.unitSuffix}`,
      zone,
      cleanersCount: cleaners,
      dayGuardsCount: dayGuards,
      nightGuardsCount: nightGuards,
      techsCount: techs,
      totalStaff,
      staffBreakdownText,
      extraScope,
      cleaners: outCleaners.textContent,
      guards: outGuards.textContent,
      tech: outTech.textContent,
      sla: outSla.textContent
    };
  }

  // Stepper (+/-) buttons for direct staff inputs
  document.querySelectorAll('.step-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const step = parseInt(btn.getAttribute('data-step'), 10) || 0;
      const inputEl = document.getElementById(targetId);
      if (inputEl) {
        const min = parseInt(inputEl.getAttribute('min'), 10) || 0;
        const max = parseInt(inputEl.getAttribute('max'), 10) || 500;
        const nextVal = clampInt((parseInt(inputEl.value, 10) || 0) + step, min, max);
        inputEl.value = nextVal;
        computeEstimator();
      }
    });
  });

  // Listen to direct typing on all number inputs
  [inputCleaners, inputDayGuards, inputNightGuards, inputTechs, unitCountInput].forEach((inp) => {
    if (inp) {
      inp.addEventListener('input', computeEstimator);
      inp.addEventListener('change', () => {
        const min = parseInt(inp.getAttribute('min'), 10) || 0;
        const max = parseInt(inp.getAttribute('max'), 10) || 5000;
        inp.value = clampInt(inp.value, min, max);
        computeEstimator();
      });
    }
  });

  if (autoSuggestBtn) {
    autoSuggestBtn.addEventListener('click', autoSuggestForSize);
  }

  propTypeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      propTypeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentPropType = btn.getAttribute('data-type');
      computeEstimator();
    });
  });

  if (zoneSelect) zoneSelect.addEventListener('change', computeEstimator);
  if (extraServiceSelect) extraServiceSelect.addEventListener('change', computeEstimator);

  // Initial calculation
  computeEstimator();

  // Send Blueprint via WhatsApp
  const sendBlueprintWhatsapp = document.getElementById('sendBlueprintWhatsapp');
  if (sendBlueprintWhatsapp) {
    sendBlueprintWhatsapp.addEventListener('click', () => {
      const state = computeEstimator();
      const msg = [
        `Hello Fami Construction Ltd (Elvis Mwenda),`,
        `I configured our property staffing requirements on your website:`,
        `• Property Profile: ${state.propTypeLabel} (${state.unitsText})`,
        `• Location Zone: ${state.zone}`,
        `• Total Personnel Needed: ${state.totalStaff} Staff`,
        `  - Cleaning Stewards: ${state.cleanersCount}`,
        `  - Day Security Officers: ${state.dayGuardsCount}`,
        `  - Night Security Officers: ${state.nightGuardsCount}`,
        `  - Maintenance Technicians: ${state.techsCount}`,
        `• Additional Scope: ${state.extraScope}`,
        `Please share a quotation / schedule a site walkthrough.`
      ].join('\n');
      window.open(
        `https://wa.me/254700590266?text=${encodeURIComponent(msg)}`,
        '_blank'
      );
    });
  }

  // Load Blueprint into Quote Form
  const loadBlueprintToForm = document.getElementById('loadBlueprintToForm');
  if (loadBlueprintToForm) {
    loadBlueprintToForm.addEventListener('click', () => {
      const state = computeEstimator();
      const locInput = document.getElementById('propertyLocation');
      const staffInput = document.getElementById('clientStaffCount');
      const notesInput = document.getElementById('projectNotes');

      if (locInput && !locInput.value) {
        locInput.value = state.zone;
      }
      if (staffInput) {
        staffInput.value = state.staffBreakdownText;
      }
      if (notesInput) {
        notesInput.value = `Property Profile: ${state.propTypeLabel} (${state.unitsText} in ${state.zone}). Requested Headcount: ${state.staffBreakdownText}. Additional Scope: ${state.extraScope}. Please arrange a site audit and formal KES quotation.`;
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 4. Quote & Site Audit Form Handling
  const quoteForm = document.getElementById('quoteForm');
  const formWhatsappBtn = document.getElementById('formWhatsappBtn');
  const formFeedback = document.getElementById('formFeedback');

  function getFormPayload() {
    const staffEl = document.getElementById('clientStaffCount');
    return {
      name: document.getElementById('clientName').value.trim() || 'Property Client',
      phone: document.getElementById('clientPhone').value.trim() || 'Not provided',
      property: document.getElementById('propertyName').value.trim() || 'Nairobi Property',
      location: document.getElementById('propertyLocation').value.trim() || 'Nairobi, Kenya',
      service: document.getElementById('serviceInterest').value,
      staffCount: staffEl ? staffEl.value.trim() || 'To be assessed on site' : 'To be assessed on site',
      notes: document.getElementById('projectNotes').value.trim() || 'Requesting site visit and quotation.'
    };
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormPayload();
      const subject = `Property Staffing & Service Inquiry: ${data.property} (${data.location})`;
      const body = [
        `Hello Elvis Mwenda / Fami Construction Limited,`,
        ``,
        `We would like to request a property walkthrough and service proposal:`,
        `• Contact Person: ${data.name}`,
        `• Phone Number: ${data.phone}`,
        `• Property / Estate Name: ${data.property}`,
        `• Location: ${data.location}`,
        `• Primary Service: ${data.service}`,
        `• Number of Personnel Needed: ${data.staffCount}`,
        `• Additional Notes: ${data.notes}`,
        ``,
        `Kind regards,`,
        `${data.name}`
      ].join('\r\n');

      formFeedback.style.display = 'block';
      formFeedback.textContent = `Proposal summary prepared for ${data.property} (${data.staffCount})! Opening your email client addressed to famiconstructions@gmail.com (or call 0700 590 266 directly).`;

      window.location.href = `mailto:famiconstructions@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  if (formWhatsappBtn) {
    formWhatsappBtn.addEventListener('click', () => {
      const data = getFormPayload();
      const msg = [
        `Hello Elvis (Fami Construction Ltd),`,
        `New Property Staffing & Service Inquiry:`,
        `• Name: ${data.name}`,
        `• Phone: ${data.phone}`,
        `• Property: ${data.property}`,
        `• Location: ${data.location}`,
        `• Service: ${data.service}`,
        `• Personnel Needed: ${data.staffCount}`,
        `• Scope: ${data.notes}`
      ].join('\n');
      window.open(
        `https://wa.me/254700590266?text=${encodeURIComponent(msg)}`,
        '_blank'
      );
    });
  }
});

// Helper used by individual service cards to pre-select service in the quote form
function selectServiceInForm(serviceName) {
  const selectEl = document.getElementById('serviceInterest');
  if (selectEl) {
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === serviceName) {
        selectEl.selectedIndex = i;
        break;
      }
    }
  }
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}
