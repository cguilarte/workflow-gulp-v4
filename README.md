## workflow-gulp-v4

1. Primero instalamos los paquetes que estan en el package.json : 
```
npm install**
```
2. Al finalizar la instalación podemos ejecutar ya el gulp :
```
gulp
```

## Opciones
En las opciones podemos modificar el host y puerto por defecto de arranque.
1. Cambiando el host default:
```
gulp --host=http://localhost
```
2. Cambiando el puerto default:  
```
gulp --port=3002
```

## Extra
1. Si queremos optimizar las imagenes deberemos ejecutar: 
```
gulp images
```
2. Si queremos sacar el css critical ejecutamos : 
```
gulp critical
``` 
Esto nos creara un css aparte en static/css/critical.css
