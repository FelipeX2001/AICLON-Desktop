import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getGoogleCalendarClient, isGoogleCalendarConnected } from '../googleCalendar.js';

const router = Router();

router.get('/status', async (req, res) => {
  try {
    const connected = await isGoogleCalendarConnected();
    res.json({ connected });
  } catch (error) {
    res.json({ connected: false });
  }
});

router.get('/events', async (req, res) => {
  try {
    const calendar = await getGoogleCalendarClient();
    const { timeMin, timeMax } = req.query;
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin as string || new Date().toISOString(),
      timeMax: timeMax as string || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100,
    });

    const events = (response.data.items || []).map(event => ({
      id: event.id,
      googleEventId: event.id,
      title: event.summary || 'Sin título',
      description: event.description || '',
      date: event.start?.dateTime 
        ? event.start.dateTime.split('T')[0] 
        : event.start?.date || '',
      startTime: event.start?.dateTime 
        ? event.start.dateTime.split('T')[1].substring(0, 5) 
        : '00:00',
      endTime: event.end?.dateTime 
        ? event.end.dateTime.split('T')[1].substring(0, 5) 
        : '23:59',
      link: event.hangoutLink || event.htmlLink || '',
      meetLink: event.hangoutLink || null,
      calendarLink: event.htmlLink || null,
      attendees: (event.attendees || []).map(a => a.email),
      isGoogleEvent: true,
      status: event.status,
    }));

    res.json(events);
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const calendar = await getGoogleCalendarClient();
    const { 
      title, 
      description, 
      date, 
      startTime, 
      endTime, 
      attendees = [],
      createMeetLink = true 
    } = req.body;

    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    const eventData: any = {
      summary: title,
      description: description || '',
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Bogota',
      },
    };

    if (attendees.length > 0) {
      eventData.attendees = attendees.map((email: string) => ({ email }));
    }

    if (createMeetLink) {
      eventData.conferenceData = {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventData,
      conferenceDataVersion: createMeetLink ? 1 : 0,
      sendUpdates: attendees.length > 0 ? 'all' : 'none',
    });

    const event = response.data as any;

    res.json({
      id: event.id,
      googleEventId: event.id,
      title: event.summary || title,
      description: event.description || '',
      date,
      startTime,
      endTime,
      link: event.hangoutLink || event.htmlLink || '',
      meetLink: event.hangoutLink || null,
      calendarLink: event.htmlLink || null,
      isGoogleEvent: true,
    });
  } catch (error: any) {
    console.error('Error creating Google Calendar event:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/events/:eventId', async (req, res) => {
  try {
    const calendar = await getGoogleCalendarClient();
    const { eventId } = req.params;
    const { 
      title, 
      description, 
      date, 
      startTime, 
      endTime, 
      attendees = [] 
    } = req.body;

    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    const eventData: any = {
      summary: title,
      description: description || '',
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Bogota',
      },
    };

    if (attendees.length > 0) {
      eventData.attendees = attendees.map((email: string) => ({ email }));
    }

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: eventData,
      sendUpdates: attendees.length > 0 ? 'all' : 'none',
    });

    const event = response.data as any;

    res.json({
      id: event.id,
      googleEventId: event.id,
      title: event.summary || title,
      description: event.description || '',
      date,
      startTime,
      endTime,
      link: event.hangoutLink || event.htmlLink || '',
      meetLink: event.hangoutLink || null,
      calendarLink: event.htmlLink || null,
      isGoogleEvent: true,
    });
  } catch (error: any) {
    console.error('Error updating Google Calendar event:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/events/:eventId', async (req, res) => {
  try {
    const calendar = await getGoogleCalendarClient();
    const { eventId } = req.params;

    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all',
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting Google Calendar event:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
