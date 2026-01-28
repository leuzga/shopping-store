/**
 * Delay Service
 *
 * Responsabilidad única: Abstracción de operaciones asincrónicas con delay
 * - Simula latencia de API de forma reactiva
 * - Reemplaza setTimeout con Observables
 * - Soporta cancelación de operaciones
 *
 * Ventajas sobre setTimeout:
 * - Composable con RxJS operators
 * - Cancelable mediante subscription cleanup
 * - Testeable sin necesidad de fakeAsync/tick
 * - Funciona con Signals y Effects
 */

import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DelayService {
  /**
   * Crear un Observable que emite después de un delay especificado
   * Útil para simular latencia de API
   *
   * @param delayMs Milisegundos de delay
   * @returns Observable que emite después del delay
   *
   * @example
   * // En un servicio que usa setTimeout actualmente:
   * setTimeout(() => { ... }, 500);
   *
   * // Cambiar a:
   * this.delayService.delay(500).subscribe(() => { ... });
   */
  delay(delayMs: number): Observable<number> {
    return timer(delayMs).pipe(
      map(() => delayMs)
    );
  }

  /**
   * Ejecutar una función después de un delay
   * Retorna un Observable para mejor composición
   *
   * @param fn Función a ejecutar
   * @param delayMs Milisegundos de delay
   * @returns Observable que completa después de ejecutar la función
   *
   * @example
   * this.delayService.execute(() => {
   *   this.doSomething();
   * }, 500).subscribe();
   */
  execute<T>(fn: () => T, delayMs: number): Observable<T> {
    return timer(delayMs).pipe(
      map(() => fn())
    );
  }

  /**
   * Crear un Observable que simula una operación asincrónica que resuelve a un valor
   *
   * @param value Valor a resolver después del delay
   * @param delayMs Milisegundos de delay
   * @returns Observable que emite el valor después del delay
   *
   * @example
   * this.delayService.resolveAfter({ success: true }, 500).subscribe(result => {
   *   console.log(result);
   * });
   */
  resolveAfter<T>(value: T, delayMs: number): Observable<T> {
    return timer(delayMs).pipe(
      map(() => value)
    );
  }

  /**
   * Crear un Observable que rechaza con un error después de un delay
   *
   * @param error Error a lanzar después del delay
   * @param delayMs Milisegundos de delay
   * @returns Observable que genera un error después del delay
   *
   * @example
   * this.delayService.rejectAfter(new Error('Failed'), 500).subscribe({
   *   error: (err) => console.error(err)
   * });
   */
  rejectAfter<T>(error: Error, delayMs: number): Observable<T> {
    return timer(delayMs).pipe(
      map(() => {
        throw error;
      })
    );
  }

  /**
   * Crear un Observable que aplica un delay a una función que retorna un valor
   * Útil para operaciones síncronas que necesitan simular latencia
   *
   * @param fn Función a ejecutar
   * @param delayMs Milisegundos de delay
   * @returns Observable que emite el resultado de fn después del delay
   *
   * @example
   * this.delayService.executeWithResult(() => {
   *   return this.calculateSomething();
   * }, 500).subscribe(result => {
   *   console.log(result);
   * });
   */
  executeWithResult<T>(fn: () => T, delayMs: number): Observable<T> {
    return timer(delayMs).pipe(
      map(() => fn())
    );
  }
}
