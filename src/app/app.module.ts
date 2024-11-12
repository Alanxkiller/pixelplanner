import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CitasComponent } from './components/citas/citas.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PaquetesComponent } from './components/paquetes/paquetes.component';
import { CalendarioComponent } from './components/calendario/calendario.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    ClientesComponent,
    CitasComponent,
    EventosComponent,
    PaquetesComponent,
    CalendarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"pixelplanner-e460d","appId":"1:201620450397:web:b075ee12c8f1bf6da9f1b4","storageBucket":"pixelplanner-e460d.appspot.com","apiKey":"AIzaSyBetkUZHwXkAJxUxqfCzVpe4n4KCONXrcU","authDomain":"pixelplanner-e460d.firebaseapp.com","messagingSenderId":"201620450397"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
