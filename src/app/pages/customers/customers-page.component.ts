
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.css'
})
export class CustomersPageComponent {

  private customerService = inject(CustomerService);

  // Listado de clientes
  customers: Customer[] = [];

  // Formulario
  customerForm: Customer = this.getEmptyCustomer();

  editingId: number | null = null;
  showForm = false;

  // Búsqueda
  searchTerm = '';

  // Paginación
  currentPage = 1;
  pageSize = 10;

  pageSizeOptions = [10, 20, 50];

  // Mensajes
  successMessage = '';

  constructor() {
    this.loadCustomers();
  }

  // Obtener clientes
  loadCustomers(): void {
    this.customers = this.customerService.getAll();
  }

  // Clientes filtrados
  get filteredCustomers(): Customer[] {

    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      return this.customers;
    }

    return this.customers.filter(customer =>
      [
        customer.nombre,
        customer.apellidos,
        customer.dni,
        customer.email,
        customer.telefono
      ].some(value => value.toLowerCase().includes(search))
    );
  }

  // Número total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.pageSize);
  }

  // Clientes correspondientes a la página actual
  get paginatedCustomers(): Customer[] {

    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredCustomers.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // Primer registro mostrado
  get startItem(): number {
    return this.filteredCustomers.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  // Último registro mostrado
  get endItem(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredCustomers.length
    );
  }

  // Comprobar si estamos editando
  get isEditing(): boolean {
    return this.editingId !== null;
  }

  // Cambiar de página
  changePage(page: number): void {

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  // Cambiar registros por página
  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  // Buscar clientes
  onSearch(): void {
    this.currentPage = 1;
  }

  // Modelo vacío
  getEmptyCustomer(): Customer {
    return {
      id: 0,
      nombre: '',
      apellidos: '',
      dni: '',
      email: '',
      telefono: '',
      fechaNacimiento: '',
      direccion: '',
      codigoPostal: '',
      ciudad: '',
      provincia: ''
    };
  }

  // Nuevo cliente
  newCustomer(): void {
    this.editingId = null;
    this.customerForm = this.getEmptyCustomer();
    this.showForm = true;
    this.successMessage = '';
  }

  // Editar cliente
  editCustomer(customer: Customer): void {
    this.editingId = customer.id;
    this.customerForm = { ...customer };
    this.showForm = true;
    this.successMessage = '';
  }

  // Guardar cliente
  saveCustomer(form: NgForm): void {

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const { id, ...customerData } = this.customerForm;

    if (this.isEditing) {

      const updated = this.customerService.update(
        this.editingId!,
        customerData
      );

      if (!updated) {
        return;
      }

      this.successMessage = 'Cliente actualizado correctamente.';

    } else {

      this.customerService.create(customerData);

      this.successMessage = 'Cliente creado correctamente.';
      this.currentPage = 1;
    }

    this.loadCustomers();
    this.closeForm();
  }

  // Eliminar cliente
  deleteCustomer(customer: Customer): void {

    const confirmed = confirm(
      `¿Estás seguro de eliminar al cliente ${customer.nombre} ${customer.apellidos}?`
    );

    if (!confirmed) {
      return;
    }

    const deleted = this.customerService.delete(customer.id);

    if (deleted) {
      this.loadCustomers();

      // Ajustar página si hemos eliminado el último registro
      if (this.currentPage > this.totalPages) {
        this.currentPage = Math.max(1, this.totalPages);
      }

      this.successMessage = 'Cliente eliminado correctamente.';
    }
  }

  // Cerrar formulario
  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.customerForm = this.getEmptyCustomer();
  }

  // Limpiar mensaje
  clearMessage(): void {
    this.successMessage = '';
  }
}
