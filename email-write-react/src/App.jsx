import { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";

function App() {
    const [email, setEmail] = useState('');
    const [tone, setTone] = useState('');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/email/generate', {
                emailContent: email,
                tone
            });
            setGeneratedEmail(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
        } catch (e) {
            setError("Failed to generate email reply. Please try again later.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant='h3' component="h1" gutterBottom>
                Email Reply Generator
            </Typography>

            <Box sx={{ mx: 3 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    label={"Original email content"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Tone (Optional)</InputLabel>
                    <Select
                        value={tone}
                        label={"Tone (optional)"}
                        onChange={(e) => setTone(e.target.value)}
                        variant='outlined'
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="casual">Casual</MenuItem>
                        <MenuItem value="friendly">Friendly</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!email || loading}
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} /> : "Generate reply"}
                </Button>
            </Box>
            {error && (
                <Typography color='error' sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            {generatedEmail && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generated Email
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        label={"Generated email content"}
                        value={generatedEmail}
                        sx={{ mb: 2 }}
                        inputProps={{ readOnly: true }}
                    />
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => navigator.clipboard.writeText(generatedEmail)}
                    >
                        Copy to Clipboard
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default App;