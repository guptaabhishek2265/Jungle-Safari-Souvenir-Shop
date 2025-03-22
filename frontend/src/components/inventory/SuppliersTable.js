import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const SuppliersTable = ({
  suppliers,
  loading,
  onAddSupplier,
  onEditSupplier,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenDetailsDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const filteredSuppliers = suppliers
    ? suppliers.filter((supplier) => {
        return (
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contactPerson
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.phone.includes(searchTerm)
        );
      })
    : [];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Suppliers</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddSupplier}
          >
            Add Supplier
          </Button>
        </Box>

        <TextField
          placeholder="Search suppliers..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">Loading suppliers data...</Typography>
        </Box>
      ) : filteredSuppliers.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">No suppliers found</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {filteredSuppliers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((supplier) => (
                <Grid item xs={12} md={6} lg={4} key={supplier.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => handleOpenDetailsDialog(supplier)}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Typography variant="h6" gutterBottom component="div">
                          {supplier.name}
                        </Typography>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditSupplier(supplier);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <PersonIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {supplier.contactPerson}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {supplier.phone}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <EmailIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {supplier.email}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        {supplier.categories &&
                          supplier.categories.map((category, index) => (
                            <Chip
                              key={index}
                              label={category}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}

      <TablePagination
        rowsPerPageOptions={[6, 12, 18]}
        component="div"
        count={filteredSuppliers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Supplier Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedSupplier && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{selectedSupplier.name}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    handleCloseDetailsDialog();
                    onEditSupplier(selectedSupplier);
                  }}
                >
                  Edit
                </Button>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1">
                    {selectedSupplier.contactPerson}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedSupplier.phone}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedSupplier.email}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {selectedSupplier.address}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Categories Supplied
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedSupplier.categories &&
                      selectedSupplier.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                  </Box>
                </Grid>

                {selectedSupplier.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {selectedSupplier.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default SuppliersTable;
