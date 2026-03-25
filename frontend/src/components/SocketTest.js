import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import useSocket from '../hooks/useSocket';

const SocketTest = () => {
    const { socket, connected } = useSocket();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (!socket) return;

        // Listen for inventory events
        socket.on('stockUpdated', (data) => {
            console.log('Stock updated:', data);
            setEvents(prev => [...prev, { type: 'stockUpdated', data, time: new Date() }]);
        });

        socket.on('lowStock', (data) => {
            console.log('Low stock alert:', data);
            setEvents(prev => [...prev, { type: 'lowStock', data, time: new Date() }]);
        });

        return () => {
            socket.off('stockUpdated');
            socket.off('lowStock');
        };
    }, [socket]);

    return (
        <Paper sx={{ p: 2, m: 2 }}>
            <Typography variant="h6" gutterBottom>
                Socket.IO Status
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Chip
                    label={connected ? 'Connected' : 'Disconnected'}
                    color={connected ? 'success' : 'error'}
                />
                {socket && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Socket ID: {socket.id}
                    </Typography>
                )}
            </Box>

            <Typography variant="subtitle1" gutterBottom>
                Real-time Events:
            </Typography>

            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {events.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No events received yet...
                    </Typography>
                ) : (
                    events.map((event, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="body2">
                                <strong>{event.type}</strong> - {event.time.toLocaleTimeString()}
                            </Typography>
                            <Typography variant="caption" component="pre">
                                {JSON.stringify(event.data, null, 2)}
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Paper>
    );
};

export default SocketTest;