import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#43967B', 
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PaginationButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#43967B',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#367a5f', 
  },
  '&:disabled': {
    color: theme.palette.action.disabled,
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));

function Pagination() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const employeesPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setEmployees(data);
        setTotalPages(Math.ceil(data.length / employeesPerPage));
      } catch (error) {
        alert('failed to fetch data');
        console.error('Error fetching data:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = Math.min(startIndex + employeesPerPage, employees.length);
  const currentEmployees = employees.slice(startIndex, endIndex);

  return (
    <div>
      <h2>Employee Data Table</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEmployees.map((employee) => (
              <StyledTableRow key={employee.id}>
                <StyledTableCell component="th" scope="row">
                  {employee.id}
                </StyledTableCell>
                <StyledTableCell>{employee.name}</StyledTableCell>
                <StyledTableCell>{employee.email}</StyledTableCell>
                <StyledTableCell>{employee.role}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <PaginationButton onClick={handlePrevious} disabled={currentPage === 1} variant="contained">
          Previous
        </PaginationButton>
        <span>{currentPage}</span>
        <PaginationButton onClick={handleNext} disabled={currentPage === totalPages} variant="contained">
          Next
        </PaginationButton>
      </Box>
    </div>
  );
}

export default Pagination;