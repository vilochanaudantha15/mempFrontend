import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import "./calender.scss";

const localizer = momentLocalizer(moment);

const CalendarScheduler = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
    color: "#ffcc00",
  });

  const handleSelect = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setEvents([...events, newEvent]);
    setOpen(false);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      description: "",
      color: "#ffcc00",
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDelete = () => {
    setEvents(events.filter((ev) => ev !== selectedEvent));
    setSelectedEvent(null);
  };

  // Custom Toolbar Component
  const CustomToolbar = (toolbar) => {
    const goToToday = () => toolbar.onNavigate("TODAY");
    const goToPrevious = () => toolbar.onNavigate("PREV");
    const goToNext = () => toolbar.onNavigate("NEXT");

    return (
      <div className="toolbar">
        <Button onClick={goToToday}>Today</Button>
        <Button onClick={goToPrevious}>Back</Button>
        <Button onClick={goToNext}>Next</Button>
        <span className="toolbarTitle">
          {moment(toolbar.date).format("MMMM YYYY")}
        </span>
        <div className="updateIcons">
          <IconButton title="Update Daily Values">📅</IconButton>
          <IconButton title="Update Annual Values">📆</IconButton>
        </div>
      </div>
    );
  };

  return (
    <div className="calendarContainer">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventClick}
        style={{ height: "100%" }}
        components={{ toolbar: CustomToolbar }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: "8px",
            padding: "5px",
            color: "#fff",
            fontWeight: "bold",
          },
        })}
        dayPropGetter={(date) => ({
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: "16px",
            fontWeight: "bold",
          },
          children: <div className="dayNumber">{moment(date).format("D")}</div>,
        })}
      />

      {/* Add Event Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={newEvent.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                name="start"
                value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                name="end"
                value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={newEvent.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Event Color"
                name="color"
                value={newEvent.color}
                onChange={handleChange}
              >
                <MenuItem value="#4A90E2">Soft Blue</MenuItem>
                <MenuItem value="#B0B0B0">Light Gray</MenuItem>
                <MenuItem value="#7ED321">Soft Green</MenuItem>
                <MenuItem value="#6F7C99">Slate Blue</MenuItem>
                <MenuItem value="#9E9E9E">Warm Gray</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSubmit}>
                Add Event
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography>
                <strong>Title:</strong> {selectedEvent.title}
              </Typography>
              <Typography>
                <strong>Start:</strong>{" "}
                {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm A")}
              </Typography>
              <Typography>
                <strong>End:</strong>{" "}
                {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm A")}
              </Typography>
              <Typography>
                <strong>Description:</strong> {selectedEvent.description}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)}>Close</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CalendarScheduler;
