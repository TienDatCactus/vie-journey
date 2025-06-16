import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

interface Permission {
  id: string;
  name: string;
  level: number;
}

interface Role {
  id: number;
  role: string;
  description: string;
  permissions: string[];
  color: string;
  bgColor: string;
}

interface EditRoleDialogProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (roleData: Partial<Role>) => void;
  loading?: boolean;
}

// Available permission types and levels
const PERMISSION_TYPES = [
  "Content Management",
  "Comment Management", 
  "User Management",
  "Report Management",
  "Asset Management",
];

const PERMISSION_LEVELS = [
  { value: 1, label: "Read" },
  { value: 2, label: "Write" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Full Access" },
];

const EditRoleDialog: React.FC<EditRoleDialogProps> = ({
  open,
  onClose,
  role,
  onSave,
  loading = false,
}) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [editingPermission, setEditingPermission] = useState<string | null>(null);
  const [newPermissionType, setNewPermissionType] = useState("");
  const [newPermissionLevel, setNewPermissionLevel] = useState<number>(1);

  // Parse permissions from string format to Permission objects
  const parsePermissions = (permissionStrings: string[]): Permission[] => {
    return permissionStrings.map((perm, index) => {
      const match = perm.match(/^(.+) \((\d+)\)$/);
      if (match) {
        return {
          id: `${index}`,
          name: match[1],
          level: parseInt(match[2]),
        };
      }
      return {
        id: `${index}`,
        name: perm,
        level: 1,
      };
    });
  };

  // Convert Permission objects back to string format
  const formatPermissions = (perms: Permission[]): string[] => {
    return perms.map(perm => `${perm.name} (${perm.level})`);
  };

  useEffect(() => {
    if (role) {
      setRoleName(role.role);
      setDescription(role.description);
      setPermissions(parsePermissions(role.permissions));
    } else {
      setRoleName("");
      setDescription("");
      setPermissions([]);
    }
    setEditingPermission(null);
    setNewPermissionType("");
    setNewPermissionLevel(1);
  }, [role, open]);

  const handleAddPermission = () => {
    if (!newPermissionType) return;
    
    const newPermission: Permission = {
      id: Date.now().toString(),
      name: newPermissionType,
      level: newPermissionLevel,
    };
    
    setPermissions([...permissions, newPermission]);
    setNewPermissionType("");
    setNewPermissionLevel(1);
  };

  const handleDeletePermission = (id: string) => {
    setPermissions(permissions.filter(perm => perm.id !== id));
  };

  const handleEditPermission = (id: string, newLevel: number) => {
    setPermissions(permissions.map(perm => 
      perm.id === id ? { ...perm, level: newLevel } : perm
    ));
    setEditingPermission(null);
  };

  const handleSave = () => {
    const roleData = {
      role: roleName,
      description,
      permissions: formatPermissions(permissions),
    };
    onSave(roleData);
  };

  const handleClose = () => {
    setEditingPermission(null);
    onClose();
  };

  const getLevelLabel = (level: number) => {
    const levelObj = PERMISSION_LEVELS.find(l => l.value === level);
    return levelObj ? levelObj.label : "Unknown";
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "default";
      case 2: return "primary";
      case 3: return "warning";
      case 4: return "error";
      default: return "default";
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: "600px" }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          {role ? "Edit Role" : "Create Role"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure role details and permissions
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Role Basic Info */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Role Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Role Name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={2}
                required
              />
            </Stack>
          </Box>

          <Divider />

          {/* Permissions Management */}
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Permissions Management
            </Typography>
            
            {/* Add New Permission */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                Add New Permission
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Permission Type</InputLabel>
                  <Select
                    value={newPermissionType}
                    onChange={(e) => setNewPermissionType(e.target.value)}
                    label="Permission Type"
                  >
                    {PERMISSION_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={newPermissionLevel}
                    onChange={(e) => setNewPermissionLevel(Number(e.target.value))}
                    label="Level"
                  >
                    {PERMISSION_LEVELS.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddPermission}
                  disabled={!newPermissionType}
                  size="small"
                >
                  Add
                </Button>
              </Stack>
            </Paper>

            {/* Current Permissions List */}
            <Typography variant="subtitle2" fontWeight="bold" mb={2}>
              Current Permissions ({permissions.length})
            </Typography>
            
            {permissions.length === 0 ? (
              <Alert severity="info">
                No permissions assigned. Add permissions using the form above.
              </Alert>
            ) : (
              <Stack spacing={1}>
                {permissions.map((permission) => (
                  <Paper key={permission.id} sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {permission.name}
                        </Typography>
                        <Chip
                          label={getLevelLabel(permission.level)}
                          color={getLevelColor(permission.level) as any}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      
                      <Stack direction="row" spacing={1}>
                        {editingPermission === permission.id ? (
                          <>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={permission.level}
                                onChange={(e) => handleEditPermission(permission.id, Number(e.target.value))}
                              >
                                {PERMISSION_LEVELS.map((level) => (
                                  <MenuItem key={level.value} value={level.value}>
                                    {level.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <IconButton
                              size="small"
                              onClick={() => setEditingPermission(null)}
                              color="default"
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => setEditingPermission(permission.id)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePermission(permission.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !roleName.trim() || !description.trim()}
          startIcon={loading ? undefined : <SaveIcon />}
        >
          {loading ? "Saving..." : "Save Role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoleDialog;
