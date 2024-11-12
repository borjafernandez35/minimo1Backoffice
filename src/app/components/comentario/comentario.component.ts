import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ComentarioService } from '../../services/comentario.service';
import { IComentario} from '../../models/comentario.model';
import { UserService } from '../../services/user.service';
import { IUser} from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { NgxPaginationModule} from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-comentario',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, TruncatePipe, NgxPaginationModule],
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.css'
})
export class ComentarioComponent implements OnInit{
  
    comentarios: IComentario[] = []; // Lista de properties
    users: IUser[] = []; // Lista de usuarios para los desplegables
    selectedusers: string[] = []; // Participantes seleccionados como ObjectId
    errorMessage: string = ''; // Variable para mostrar mensajes de error
    activityId: string[] = [];
    @Input() totalUsers:any;
    @Input() totalProperty:any;
  @Input()currentPage:any;
  @Input()limit:any=2;
  @Input()total:any;
  @Input()totally:any=0;
    @Output()
    pageChange!: EventEmitter<number>;
  totalPages:any;
  totalPagesUser:any;
  desplegado: boolean[] = [];
  comment:any;
  
  
  
    // Estructura inicial para una nueva comentario
    newComment: IComentario = {
      user: '',
      likes: 0,
      description: '',
    };
  
    comentarioEdicion: IComentario | null = null; // Usuario en proceso de edición
    indiceEdicion: number | null = null; // Almacena el índice del usuario en edición
    formSubmitted: boolean = false; // Indica si se ha enviado el formulario
  
    count:number=0;
    page: number=1 ;
    pageUser: number=1 ;
    limitProperties = [2,3, 6];
    user:any;
  
    constructor(private comentarioService: ComentarioService, private userService: UserService, private dialog: MatDialog) {}
  
    ngOnInit(): void {
      this.getComments(); // Obtener la lista de properties
      this.getUsers(); // Obtener la lista de usuarios
  
    }
  
    // Obtener la lista de properties desde la API
    getComments(): void {
      this.comentarioService.getComentario(this.page, this.limit).subscribe(comments => {
          this.comment = comments; // Asignar las propiedades
          this.total = this.comment.totalActivity; // Asignar el total de propiedades
          this.totalPages = this.comment.totalPages;
          this.comentarios=this.comment.comentarios;
          console.log('Propiedades del usuario recibidas:',this.comment );
          console.log("paginas comentarios:",this.count,this.page);
          console.log("Todos las comentarios",this.total,this.comment.totalActivity);
          console.log("estoy dentro comentarios",this.comentarios);
       
      })
    }
  
    // Obtener la lista de usuarios desde la API
    getUsers(): void {
      // Call the userService to fetch users
      this.userService.getUsers(this.pageUser, this.totally).subscribe(users => {
        console.log("users comment",users);
        console.log("paginas user",this.pageUser);
          this.user = users;            // Assign the received data to this.user
          this.totalPages=this.user.totalPages;
          // this.totally = this.user.totalUser;  // Total number of users
          this.users=this.user.users;
          
          console.log("Todos los usuarios properties",this.total,this.user.totalUsers);
          console.log("estoy dentro user properties",this.users);
     
                  // Assign all users to this.users
              this.desplegado = new Array(this.users.length).fill(false);  // Initialize desplegado
            }
            
          
        
        
      );
    }
  
    
    handlePageChange(event: number): void {
      console.log(this.count);
      this.page = event;
      console.log(this.page);
      this.ngOnInit();
    }
  
    handleLimitChange(event: any): void {
      this.limit = event.target.value;
      this.page = 1;
      this.ngOnInit();
    }
  
  
    // Obtener el nombre de un usuario dado su ObjectId
    getUserNameById(userId: string): string {
      const user = this.users.find((u) => u._id === userId);
      return user ? user.name : 'Desconocido';
    }
  
    // Manejar el envío del formulario con validación de campos
    onSubmit(propertyForm: NgForm): void {
      this.errorMessage = ''; // Limpiar mensajes de error
  
      // Verificar si los campos están vacíos
      if (!this.newComment.user || !this.newComment.likes || !this.newComment.description) {
        this.errorMessage = 'Todos los campos son obligatorios.';
        return;
      }
      if (this.indiceEdicion !== null) {
        this.comentarios[this.indiceEdicion] = { ...this.newComment, _id: this.comentarios[this.indiceEdicion]._id };
    
        // Actualizar el usuario en la API
        this.comentarioService.updateComentario(this.comentarios[this.indiceEdicion]).subscribe(response => {
          console.log('Usuario actualizado:', response);
        
        })
        // Limpiar el estado de edición
        this.indiceEdicion = null;
      }else{
  
        // Llamar al servicio para agregar la nueva property
        this.comentarioService.addComentario(this.newComment).subscribe(
          (response) => {
            console.log('comment create:', response);
            this.getComments(); // Actualizar la lista de properties después de crear una nueva
            this.resetForm(); // Limpiar el formulario
          },
          (error) => {
            console.error('Error al crear el comentario:', error);
          }
        );
      }
  
      this.resetForm();
    }
  
    prepararEdicion(comment: IComentario, index: number): void{
      this.comentarioEdicion = { ...comment }; // Clonar el usuario para la edición
      this.newComment = { ...comment }; // Cargar los datos del usuario en el formulario
      this.indiceEdicion = index; // Almacenar el índice del usuario en edición
      this.desplegado[index] = true; // Abrir el desplegable del usuario que se está editando
    }
  
    // Método para eliminar una property por su ID
    deleteComment(commentId: string): void {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        width: '350px',
        data: { mensaje: `¿Estás seguro de que deseas eliminar el comentario?` }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) { 
          this.comentarioService.deleteComentario(commentId).subscribe(
            () => {
             console.log(`Property con ID ${commentId} eliminada`);
              this.getComments(); 
           },
           (error) => {
              console.error('Error al eliminar la property:', error);
           }
         );
       }
     });
    }
  
  
    // Resetear el formulario después de crear una property
    resetForm(): void {
      this.newComment = {
        user: '',
        likes: 0,
        description: '',
      };
      this.errorMessage = ''; // Limpiar el mensaje de error
    }
  }
  


