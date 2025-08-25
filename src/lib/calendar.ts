export interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
}

export const generateCalendarLinks = (event: CalendarEvent) => {
  const { title, description = '', startDate, endDate = startDate, location = '' } = event;
  
  // Format dates for different calendar systems
  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatDateForCalendar(startDate);
  const end = formatDateForCalendar(endDate);
  const dates = `${start}/${end}`;

  // Google Calendar URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  // Outlook Calendar URL
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&startdt=${start}&enddt=${end}&location=${encodeURIComponent(location)}`;

  // Office 365 Calendar URL
  const office365Url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&startdt=${start}&enddt=${end}&location=${encodeURIComponent(location)}`;

  return {
    google: googleUrl,
    outlook: outlookUrl,
    office365: office365Url,
  };
};

export const generateICSFile = (event: CalendarEvent) => {
  const { title, description = '', startDate, endDate = startDate, location = '' } = event;
  
  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatDateForICS(startDate);
  const end = formatDateForICS(endDate);
  const now = formatDateForICS(new Date());

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Jenga Biz Africa//Business Milestones//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
DTSTAMP:${now}
UID:${Date.now()}@jengabiz.africa
CREATED:${now}
DESCRIPTION:${description}
LAST-MODIFIED:${now}
LOCATION:${location}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${title}
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

  return icsContent;
};

export const downloadICSFile = (event: CalendarEvent, filename?: string) => {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename || `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};

export const addToCalendar = (event: CalendarEvent) => {
  // Detect platform and open appropriate calendar
  const userAgent = navigator.userAgent.toLowerCase();
  const links = generateCalendarLinks(event);
  
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    // iOS devices - download ICS file which will open in Calendar app
    downloadICSFile(event);
  } else if (userAgent.includes('android')) {
    // Android devices - try Google Calendar first
    window.open(links.google, '_blank');
  } else {
    // Desktop - show options or default to Google Calendar
    window.open(links.google, '_blank');
  }
};