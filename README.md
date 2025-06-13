# Gastroturismo

## IMPORTANTE Tengo los datos en una hoja Google Sheet con difrendtes libros

## IMPORTANTE Uso Google Apps Script para generar las paginas

## IMPORTANTE Las paginas las coloco en un iframe en Google Sites

## IMPRTANTE: Por motivos de seguridad, cuando se inserta un bloque de HTML en una página usando la propiedad innerHTML, los navegadores intencionadamente no ejecutan las etiquetas <script> que vienen dentro de ese bloque de HTML.

## Codigo.gs 
 * Sirve la carcasa principal de la Aplicación de Página Única (SPA).
 * Esta es la única página que se carga desde el navegador.

Quiero adpatar el codigo para que te mostrare con este resultado, pero adaptado al proyecto y sus estilos en tapeo.html modificando los ficheros necesarios:

1. Seleccionar una autonomia
  ![image](https://github.com/user-attachments/assets/b22f4ed8-9d98-4fce-914c-8c9659455e6c)
2. Seleccionar una provincia, en caso de que la autonomia tenga una sola provincia automaticamente mostrar las ciudades de la provincia
  ![image](https://github.com/user-attachments/assets/c12d534d-80e3-4ff5-bfc1-5415bceacdd0)
3. Seleccionar una ciudad, en caso de que la provincia tenga una sola ciudad automaticamente mostrar los barrios de la ciudad
  ![image](https://github.com/user-attachments/assets/705c005b-5cb5-49ca-9521-2640f1913ed2)
4. Seleccionar una barrio, en caso de que la ciudad tenga un solo barrios automaticamente mostrar los sitios de tapeo
  ![image](https://github.com/user-attachments/assets/5ec35f8e-e1de-4cb6-90c6-30f5b281305f)
5. Mostrar un listado de los sitios del barrio
   ![image](https://github.com/user-attachments/assets/ae4dd210-6309-4d0f-bcbf-af9918a524a0)

A tener en cuante un boton "atrasr" tiene que tener en cuenta si lo elegido tiene una o varias opciones para volver un paso o los necesarios
