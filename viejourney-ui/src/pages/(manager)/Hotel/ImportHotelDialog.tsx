import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

interface Hotel {
  _id: string;
  name: string;
  description: string;
  rating: number;
  address: string;
  coordinate: string;
  image: string[];
}

interface ImportHotelDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (hotels: Hotel[]) => void;
  loading?: boolean;
}

const ImportHotelDialog: React.FC<ImportHotelDialogProps> = ({
  open,
  onClose,
  onImport,
  loading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  }>({ success: 0, errors: [] });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus('idle');
      setImportResults({ success: 0, errors: [] });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImportStatus('processing');
    setImportProgress(0);

    try {
      // Simulate file processing
      const fileContent = await selectedFile.text();
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Parse JSON or CSV (simplified example)
      let hotelsData: any[] = [];
      
      if (selectedFile.type === 'application/json') {
        hotelsData = JSON.parse(fileContent);
      } else {
        // For CSV, you would need a proper CSV parser
        throw new Error('CSV import not implemented yet. Please use JSON format.');
      }

      // Validate and transform data
      const validHotels: Hotel[] = [];
      const errors: string[] = [];

      hotelsData.forEach((item, index) => {
        try {
          if (!item.name || !item.description || !item.address) {
            errors.push(`Row ${index + 1}: Missing required fields (name, description, address)`);
            return;
          }

          const hotel: Hotel = {
            _id: item._id || Date.now().toString() + index,
            name: item.name,
            description: item.description,
            rating: parseFloat(item.rating) || 0,
            address: item.address,
            coordinate: item.coordinate || "",
            image: Array.isArray(item.image) ? item.image : (item.image ? [item.image] : []),
          };

          validHotels.push(hotel);
        } catch (error) {
          errors.push(`Row ${index + 1}: Invalid data format`);
        }
      });

      setImportResults({
        success: validHotels.length,
        errors,
      });

      if (validHotels.length > 0) {
        setImportStatus('success');
        onImport(validHotels);
      } else {
        setImportStatus('error');
      }

    } catch (error) {
      setImportStatus('error');
      setImportResults({
        success: 0,
        errors: [`File parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportProgress(0);
    setImportStatus('idle');
    setImportResults({ success: 0, errors: [] });
    onClose();
  };

  const getStatusColor = () => {
    switch (importStatus) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'processing': return 'info';
      default: return 'info';
    }
  };

  const getStatusIcon = () => {
    switch (importStatus) {
      case 'success': return <SuccessIcon />;
      case 'error': return <ErrorIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: "500px" }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Import Hotels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a JSON or CSV file to import multiple hotels
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* File Upload */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Select File
            </Typography>
            
            <Paper
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: selectedFile ? 'primary.main' : 'grey.300',
                bgcolor: selectedFile ? 'primary.50' : 'grey.50',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              <Stack alignItems="center" spacing={2}>
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedFile ? selectedFile.name : 'Choose a file to upload'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: JSON, CSV (Max size: 10MB)
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Import Progress */}
          {importStatus === 'processing' && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Import Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={importProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Processing... {importProgress}%
              </Typography>
            </Box>
          )}

          {/* Import Results */}
          {(importStatus === 'success' || importStatus === 'error') && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Import Results
              </Typography>
              
              <Alert 
                severity={getStatusColor()} 
                icon={getStatusIcon()}
                sx={{ mb: 2 }}
              >
                {importStatus === 'success' 
                  ? `Successfully imported ${importResults.success} hotels`
                  : 'Import completed with errors'
                }
              </Alert>

              {importResults.success > 0 && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                    ✓ {importResults.success} hotels imported successfully
                  </Typography>
                </Paper>
              )}

              {importResults.errors.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: 'error.50' }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="error.main" mb={1}>
                    ⚠ {importResults.errors.length} errors found:
                  </Typography>
                  <List dense>
                    {importResults.errors.slice(0, 5).map((error, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={error}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            color: 'error.main'
                          }}
                        />
                      </ListItem>
                    ))}
                    {importResults.errors.length > 5 && (
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={`... and ${importResults.errors.length - 5} more errors`}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            color: 'error.main',
                            fontStyle: 'italic'
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          )}

          {/* Format Instructions */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              File Format Requirements
            </Typography>
            <Alert severity="info">
              <Typography variant="body2" component="div">
                <strong>JSON format example:</strong>
                <pre style={{ margin: '8px 0', fontSize: '12px' }}>
{`[
  {
    "name": "Hotel Name",
    "description": "Hotel description",
    "rating": 4.5,
    "address": "Hotel address",
    "coordinate": "{'latitude': 12.34, 'longitude': 56.78}",
    "image": ["image1.jpg", "image2.jpg"]
  }
]`}
                </pre>
              </Typography>
            </Alert>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading || importStatus === 'processing'}>
          {importStatus === 'success' ? 'Close' : 'Cancel'}
        </Button>
        {importStatus !== 'success' && (
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={!selectedFile || loading || importStatus === 'processing'}
            startIcon={<UploadIcon />}
          >
            {importStatus === 'processing' ? 'Importing...' : 'Import Hotels'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportHotelDialog;
