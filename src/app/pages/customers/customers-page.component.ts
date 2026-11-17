
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Customer {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
}

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.css'
})
export class CustomersPageComponent {

  // Listado inicial de clientes de ejemplo
  customers: Customer[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellidos: 'García López',
      dni: '12345678A',
      email: 'juan@email.com',
      telefono: '600123456',
      fechaNacimiento: '1985-05-12',
      direccion: 'Calle Mayor 15',
      codigoPostal: '29001',
      ciudad: 'Málaga',
      provincia: 'Málaga'
    },
    {
      id: 2,
      nombre: 'María',
      apellidos: 'Fernández Ruiz',
      dni: '87654321B',
      email: 'maria@email.com',
      telefono: '611223344',
      fechaNacimiento: '1990-08-20',
      direccion: 'Avenida Andalucía 22',
      codigoPostal: '41001',
      ciudad: 'Sevilla',
      provincia: 'Sevilla'
    }
  ];

  // Control del formulario
  customerForm: Customer = this.getEmptyCustomer();

  editingId: number | null = null;
  showForm = false;

  // Búsqueda
  searchTerm = '';

  // Mensajes
  successMessage = '';

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

  get isEditing(): boolean {
    return this.editingId !== null;
  }

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

  // Abrir formulario de creación
  newCustomer(): void {
    this.editingId = null;
    this.customerForm = this.getEmptyCustomer();
    this.showForm = true;
    this.successMessage = '';
  }

  // Abrir formulario de edición
  editCustomer(customer: Customer): void {
    this.editingId = customer.id;
    this.customerForm = { ...customer };
    this.showForm = true;
    this.successMessage = '';
  }

  // Guardar cliente (crear o actualizar)
  saveCustomer(form: NgForm): void {

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isEditing) {

      this.customers = this.customers.map(customer =>
        customer.id === this.editingId
          ? { ...this.customerForm, id: customer.id }
          : customer
      );

      this.successMessage = 'Cliente actualizado correctamente.';

    } else {

      const newCustomer: Customer = {
        ...this.customerForm,
        id: this.getNextId()
      };

      this.customers = [...this.customers, newCustomer];

      this.successMessage = 'Cliente creado correctamente.';
    }

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

    this.customers = this.customers.filter(
      item => item.id !== customer.id
    );

    this.successMessage = 'Cliente eliminado correctamente.';
  }

  // Cerrar formulario
  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.customerForm = this.getEmptyCustomer();
  }

  // Generar identificador
  private getNextId(): number {
    return this.customers.length
      ? Math.max(...this.customers.map(c => c.id)) + 1
      : 1;
  }

  // Limpiar mensaje
  clearMessage(): void {
    this.successMessage = '';
  }
}

