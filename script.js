/**
 * PT. KING INDO CELEBES LOGISTICS - Landing Page Script
 * Interactivity: Dynamic Quote WhatsApp Generator & Floating Support Widget
 */

document.addEventListener('DOMContentLoaded', () => {

  // Default WhatsApp Business Number (Indonesian code +62)
  const WHATSAPP_NUMBER = '6282123456789';

  // DOM Elements - Header & Nav
  const mainHeader = document.getElementById('mainHeader');
  const progressBar = document.getElementById('progressBar');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // DOM Elements - WhatsApp Widget
  const whatsappFloatingWidget = document.getElementById('whatsappFloatingWidget');
  const whatsappTriggerBtn = document.getElementById('whatsappTriggerBtn');
  const whatsappChatPopup = document.getElementById('whatsappChatPopup');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const btnStartWhatsAppChat = document.getElementById('btnStartWhatsAppChat');
  const notifBadge = whatsappTriggerBtn.querySelector('.btn-badge-notif');

  // DOM Elements - Calculator Form
  const quoteForm = document.getElementById('quoteForm');
  const serviceType = document.getElementById('serviceType');
  const originCity = document.getElementById('originCity');
  const destCity = document.getElementById('destCity');
  const cargoDetail = document.getElementById('cargoDetail');
  const senderName = document.getElementById('senderName');
  const shippingDate = document.getElementById('shippingDate');
  const specialNotes = document.getElementById('specialNotes');
  const adminTarget = document.getElementById('adminTarget');
  const whatsappPreview = document.getElementById('whatsappPreview');

  /* ==========================================================================
     1. Scroll & Scroll-Progress Monitor
     ========================================================================== */
  window.addEventListener('scroll', () => {
    // 1.1 Calculate scroll progress percentage
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';

    // 1.2 Fallback Header Scrolling Class
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. Mobile Menu Interactivity
     ========================================================================== */
  function toggleMobileMenu() {
    const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('active');
    
    // Toggle aria-hidden on mobile navigation for screen readers
    mobileNav.setAttribute('aria-hidden', isExpanded);
  }

  mobileNavToggle.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  /* ==========================================================================
     3. Service Card Pre-Selection Helper
     ========================================================================== */
  window.selectServiceForm = (serviceKey) => {
    let selectValue = '';
    
    switch (serviceKey) {
      case 'kendaraan':
        selectValue = 'Pengiriman Kendaraan';
        break;
      case 'proyek':
        selectValue = 'Kargo Industri Proyek';
        break;
      case 'umum':
        selectValue = 'Kargo Umum / Logistik';
        break;
    }

    if (selectValue) {
      serviceType.value = selectValue;
      
      // Manually trigger the input change event to update the preview immediately
      updateWhatsAppPreview();
    }
  };

  /* ==========================================================================
     4. WhatsApp Floating Widget Logic
     ========================================================================== */
  let chatPopupOpened = false;

  function toggleWhatsAppPopup() {
    const isActive = whatsappChatPopup.classList.contains('active');
    
    if (!isActive) {
      whatsappChatPopup.classList.add('active');
      whatsappTriggerBtn.setAttribute('aria-expanded', 'true');
      whatsappChatPopup.setAttribute('aria-hidden', 'false');
      
      // Hide notification badge when user clicks to open
      if (notifBadge) {
        notifBadge.style.display = 'none';
      }
      chatPopupOpened = true;
    } else {
      whatsappChatPopup.classList.remove('active');
      whatsappTriggerBtn.setAttribute('aria-expanded', 'false');
      whatsappChatPopup.setAttribute('aria-hidden', 'true');
    }
  }

  whatsappTriggerBtn.addEventListener('click', toggleWhatsAppPopup);
  chatCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent trigger button from firing click immediately after
    whatsappChatPopup.classList.remove('active');
    whatsappTriggerBtn.setAttribute('aria-expanded', 'false');
    whatsappChatPopup.setAttribute('aria-hidden', 'true');
  });

  // Automatically trigger WhatsApp popup after 5 seconds to grab attention (only once per session)
  setTimeout(() => {
    if (!chatPopupOpened && !whatsappChatPopup.classList.contains('active')) {
      whatsappChatPopup.classList.add('active');
      whatsappTriggerBtn.setAttribute('aria-expanded', 'true');
      whatsappChatPopup.setAttribute('aria-hidden', 'false');
      
      if (notifBadge) {
        notifBadge.classList.add('pulse');
      }
    }
  }, 5000);

  /* ==========================================================================
     5. Interactive Form & WhatsApp Message Generator
     ========================================================================== */
  function formatWhatsAppMessage() {
    const sType = serviceType.value || '[Belum Memilih Layanan]';
    const origin = originCity.value === 'Other' ? 'Kota Lain' : (originCity.value || '[Belum Memilih Asal]');
    const dest = destCity.value === 'Other' ? 'Kota Lain' : (destCity.value || '[Belum Memilih Tujuan]');
    const cargo = cargoDetail.value.trim() || '[Belum Mengisi Detail Barang]';
    const name = senderName.value.trim() || '[Belum Mengisi Nama]';
    
    let formattedDate = '-';
    if (shippingDate.value) {
      const dateParts = shippingDate.value.split('-');
      if (dateParts.length === 3) {
        formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // DD/MM/YYYY
      }
    }
    
    const notes = specialNotes.value.trim() || 'Tidak ada catatan tambahan.';

    // Construct the structured Whatsapp template
    return `*PT. KING INDO CELEBES LOGISTICS*
_Permintaan Estimasi Pengiriman Resmi_

• *Nama Pengirim*  : ${name}
• *Layanan Kargo*  : ${sType}
• *Rute Pengiriman*: ${origin} ➔ ${dest}
• *Detail Muatan*  : ${cargo}
• *Rencana Kirim*  : ${formattedDate}
• *Catatan Khusus* : ${notes}

_Halo tim operasional King Indo Celebes, mohon bantu cek estimasi tarif resmi untuk rincian pengiriman di atas. Terima kasih!_`;
  }

  function updateWhatsAppPreview() {
    // Generate text message
    const rawMsg = formatWhatsAppMessage();
    
    // Set text in preview box
    whatsappPreview.textContent = rawMsg;
  }

  // Bind input listeners to trigger the update on any change
  const inputElements = [serviceType, adminTarget, originCity, destCity, cargoDetail, senderName, shippingDate, specialNotes];
  inputElements.forEach(elem => {
    if (elem) {
      elem.addEventListener('input', updateWhatsAppPreview);
      elem.addEventListener('change', updateWhatsAppPreview);
    }
  });

  // Handle Form Submission
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop default form redirect

    // Build the final WhatsApp message
    const messageText = formatWhatsAppMessage();
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(messageText);
    
    // Get target admin number dynamically
    const targetNumber = adminTarget?.value || '628881269843';
    
    // Create WhatsApp Click-To-Chat link
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank', 'noopener');
  });

  // Initialize preview on first load
  updateWhatsAppPreview();

});
