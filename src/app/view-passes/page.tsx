"use client"
import React from "react";
// import type { Key } from "react";
import { Key } from "@react-types/shared";
import axios from "axios";
import { Search, Plus, MoreVertical, ChevronDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  SortDescriptor,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from "@heroui/react";

// Define columns for visitor passes
export const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "EMAIL", uid: "email"},
  {name: "PHONE", uid: "phone"},
  {name: "START DATE", uid: "dateStart", sortable: true},
  {name: "END DATE", uid: "dateEnd", sortable: true},
  {name: "REASON", uid: "reason"},
  {name: "ADDRESS", uid: "address"},
  {name: "ACTIONS", uid: "actions"}
];

const INITIAL_VISIBLE_COLUMNS = ["name", "phone", "dateStart", "dateEnd", "reason", "actions"];

interface VisitorPass {
  id: number;
  name: string;
  phone: string;
  email: string;
  dateStart: string;
  dateEnd: string;
  reason: string;
  address: string;
}

export default function VisitorTable() {
  // State management
  const [passes, setPasses] = React.useState<VisitorPass[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<"all" | Set<Key>>(new Set<Key>());
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "descending"
  });
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedPassId, setSelectedPassId] = React.useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Fetch passes data
  React.useEffect(() => {
    const fetchPasses = async () => {
      try {
        const response = await axios.get('/api/get-tickets');
        setPasses(response.data);
      } catch (error) {
        console.error('Failed to fetch passes:', error);
        setFeedbackMessage({
          type: 'error',
          message: 'Failed to load passes. Please refresh the page.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPasses();
  }, []);

  // Delete handlers
  const handleDeleteClick = (id: number) => {
    setSelectedPassId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPassId) return;

    try {
      setIsDeleting(selectedPassId);
      await axios.delete(`/api/delete-pass?id=${selectedPassId}`);
      
      setPasses(prevPasses => prevPasses.filter(pass => pass.id !== selectedPassId));
      
      setFeedbackMessage({
        type: 'success',
        message: 'The visitor pass has been successfully deleted.'
      });

      setShowDeleteModal(false);
      
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to delete pass:', error);
      setFeedbackMessage({
        type: 'error',
        message: 'Failed to delete the pass. Please try again.'
      });
    } finally {
      setIsDeleting(null);
      setSelectedPassId(null);
    }
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.size === columns.length) return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPasses = [...passes];

    if (hasSearchFilter) {
      filteredPasses = filteredPasses.filter((pass) =>
        pass.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        pass.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        pass.phone.includes(filterValue)
      );
    }

    return filteredPasses;
  }, [passes, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: VisitorPass, b: VisitorPass) => {
      const first = a[sortDescriptor.column as keyof VisitorPass];
      const second = b[sortDescriptor.column as keyof VisitorPass];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((pass: VisitorPass, columnKey: Key) => {
    const cellValue = pass[columnKey as keyof VisitorPass];

    switch (columnKey) {
      case "dateStart":
      case "dateEnd":
        return new Date(cellValue as string).toLocaleDateString();
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical className="text-default-300" size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem 
                  key="delete" 
                  className="text-danger" 
                  color="danger"
                  isDisabled={isDeleting !== null}
                  onClick={() => handleDeleteClick(pass.id)}
                >
                  {isDeleting === pass.id ? "Deleting..." : "Delete"}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [isDeleting]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: { target: { value: any; }; }) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name, email or phone..."
            startContent={<Search className="text-default-300" size={20} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDown className="text-small" size={20} />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(new Set(keys as unknown as string[]))}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<Plus size={20} />}>
              Add New Pass
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {passes.length} passes</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onRowsPerPageChange, passes.length, onSearchChange]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Skeleton Top Content */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between gap-3 items-end">
            <div className="w-[44%] h-10 bg-default-200 rounded-lg animate-pulse" />
            <div className="flex gap-3">
              <div className="w-24 h-10 bg-default-200 rounded-lg animate-pulse" />
              <div className="w-32 h-10 bg-primary-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Skeleton Table */}
        <div className="w-full border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex bg-default-100 h-12 items-center px-4 border-b">
            {INITIAL_VISIBLE_COLUMNS.map((_, index) => (
              <div 
                key={index}
                className="flex-1 h-4 bg-default-200 rounded animate-pulse mr-4"
              />
            ))}
          </div>

          {/* Rows */}
          {[...Array(5)].map((_, rowIndex) => (
            <div 
              key={rowIndex}
              className="flex items-center h-16 px-4 border-b last:border-b-0"
            >
              {INITIAL_VISIBLE_COLUMNS.map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className="flex-1 mr-4"
                >
                  <div 
                    className={`h-4 bg-default-200 rounded animate-pulse ${
                      colIndex === 1 ? 'w-1/2' : 'w-3/4'
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Skeleton Bottom Content */}
        <div className="flex justify-between items-center mt-4">
          <div className="w-32 h-8 bg-default-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="w-24 h-8 bg-default-200 rounded animate-pulse" />
            <div className="w-24 h-8 bg-default-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Feedback Message */}
      {feedbackMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md ${
            feedbackMessage.type === 'success' 
              ? 'bg-success-100 text-success-700' 
              : 'bg-danger-100 text-danger-700'
          }`}
        >
          {feedbackMessage.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this visitor pass? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button 
              color="default" 
              variant="light" 
              onPress={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              color="danger" 
              onPress={handleDelete}
              isLoading={isDeleting !== null}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Table
        isHeaderSticky
        aria-label="Visitor passes table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No passes found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}