
import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // Almacenamiento temporal en memoria
private customers: Customer[] = this.generateCustomers();

private generateCustomers(): Customer[] {

const nombres = [
    'Juan', 'María', 'Antonio', 'Laura', 'Carlos',
    'Ana', 'José', 'Marta', 'Francisco', 'Lucía',
    'David', 'Carmen', 'Daniel', 'Elena', 'Manuel',
    'Paula', 'Pedro', 'Isabel', 'Miguel', 'Sara'
];

const apellidos = [
    'García', 'Fernández', 'González', 'Rodríguez',
    'López', 'Martínez', 'Sánchez', 'Pérez',
    'Gómez', 'Martín', 'Jiménez', 'Ruiz',
    'Hernández', 'Díaz', 'Moreno', 'Álvarez',
    'Romero', 'Alonso', 'Gutiérrez', 'Navarro'
];

const ciudades = [
    { ciudad: 'Málaga', provincia: 'Málaga', cp: '29001' },
    { ciudad: 'Sevilla', provincia: 'Sevilla', cp: '41001' },
    { ciudad: 'Granada', provincia: 'Granada', cp: '18001' },
    { ciudad: 'Córdoba', provincia: 'Córdoba', cp: '14001' },
    { ciudad: 'Cádiz', provincia: 'Cádiz', cp: '11001' },
    { ciudad: 'Almería', provincia: 'Almería', cp: '04001' },
    { ciudad: 'Jaén', provincia: 'Jaén', cp: '23001' },
    { ciudad: 'Huelva', provincia: 'Huelva', cp: '21001' },
    { ciudad: 'Marbella', provincia: 'Málaga', cp: '29601' },
    { ciudad: 'Antequera', provincia: 'Málaga', cp: '29200' }
];

const calles = [
    'Calle Mayor',
    'Avenida Andalucía',
    'Calle Real',
    'Calle Granada',
    'Avenida de la Constitución',
    'Calle Nueva',
    'Calle Cervantes',
    'Plaza España',
    'Calle San Juan',
    'Avenida Europa'
];

return Array.from({ length: 100 }, (_, index) => {

    const id = index + 1;

    const nombre = nombres[index % nombres.length];

    const apellido1 = apellidos[index % apellidos.length];

    const apellido2 = apellidos[
    (index * 7 + 3) % apellidos.length
    ];

    const ciudad = ciudades[index % ciudades.length];

    const dniNumber = (12345678 + index).toString();

    const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    const dni = dniNumber +
    dniLetters[Number(dniNumber) % 23];

    const fecha = new Date(
    1970 + (index % 35),
    index % 12,
    (index % 28) + 1
    );

    const fechaNacimiento =
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

    return {
    id,
    nombre,
    apellidos: `${apellido1} ${apellido2}`,
    dni,
    email: `cliente${id}@email.com`,
    telefono: `6${String(10000000 + id).slice(0, 8)}`,
    fechaNacimiento,
    direccion: `${calles[index % calles.length]} ${index + 1}`,
    codigoPostal: ciudad.cp,
    ciudad: ciudad.ciudad,
    provincia: ciudad.provincia
    };
});
}

  // Obtener todos los clientes
  getAll(): Customer[] {
    return [...this.customers];
  }

  // Obtener un cliente por ID
  getById(id: number): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  // Crear un cliente
  create(customer: Omit<Customer, 'id'>): Customer {

    const newCustomer: Customer = {
      ...customer,
      id: this.getNextId()
    };

    this.customers = [...this.customers, newCustomer];

    return newCustomer;
  }

  // Actualizar un cliente
  update(id: number, customer: Omit<Customer, 'id'>): Customer | undefined {

    const exists = this.customers.some(item => item.id === id);

    if (!exists) {
      return undefined;
    }

    const updatedCustomer: Customer = {
      ...customer,
      id
    };

    this.customers = this.customers.map(item =>
      item.id === id ? updatedCustomer : item
    );

    return updatedCustomer;
  }

  // Eliminar un cliente
  delete(id: number): boolean {

    const exists = this.customers.some(item => item.id === id);

    if (!exists) {
      return false;
    }

    this.customers = this.customers.filter(item => item.id !== id);

    return true;
  }

  // Generar el siguiente ID
  private getNextId(): number {
    return this.customers.length
      ? Math.max(...this.customers.map(customer => customer.id)) + 1
      : 1;
  }
}
