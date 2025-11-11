from dotenv import load_dotenv
from datetime import date
import logging
from app.repositories.user_repository import UserRepository
from app.config.database import get_db
from app.schemas.user_schema import UserCreate # Import UserCreate schema
from app.core.security import hash_password # Import hash_password

load_dotenv()

# Configuración de logging básico
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# ============================================================================
# DATOS EXTRAÍDOS DE SU ARCHIVO usuarios.sql
# ============================================================================
EMPLEADOS_DATA = [
    ('0CH21', 'David Lu', 'Catorcenal', 'Aerospace', 'Chino', 'Project Management', 'No sindicalizado'),
    ('0CN199', 'Molán Zhang', 'Catorcenal', 'Aerospace', 'Chino', 'Finanzas', 'No sindicalizado'),
    ('0E311', 'Mark White', 'Desconocido', 'Aerospace', 'Externo', 'Technical Director', 'Desconocido'),
    ('0E312', 'Miki Chiou', 'Desconocido', 'Aerospace', 'Externo', 'President IAUS', 'Desconocido'),
    ('114', 'Maria Guadalupe Garcia Garcia', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('119CN', 'Han Jinjing', 'Catorcenal', 'Aerospace', 'Chino', 'Exp.', 'No sindicalizado'),
    ('1205', 'Maria De Los Angeles Guerrero Contreras', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('120CN', 'Zhao Quanhong', 'Catorcenal', 'Aerospace', 'Chino', 'Exp.', 'No sindicalizado'),
    ('2400', 'Jose Ivan Perez Leza', 'Catorcenal', 'Aerospace', 'Mexicano', 'Recursos Humanos', 'No sindicalizado'),
    ('2401A', 'Jorge Alejandro Chora Cavazos', 'Catorcenal', 'Aerospace', 'Mexicano', 'Sr. Manager', 'No sindicalizado'),
    ('3371', 'Juan Carlos Rodriguez Aguilar', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('3407', 'Braulio Rodriguez Hernandez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('3408', 'Erika Flores Fonseca', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('4249', 'Juan Pablo Carrillo Bravo', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('4314', 'Francisco Javier Mota Hernandez', 'Semanal', 'AEROSPACE', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5055', 'Fernando Miranda Cuevas', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5109', 'David Angel Ávila Rosas', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5137', 'Karina Lizbeth Infante', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5171', 'Juan Alan Juarez Uribe', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5172', 'Victor Manuel Gonzalez Martinez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5173', 'Graciela Gonzalez Benitez', 'Catorcenal', 'Aerospace', 'Aerospace Plant', 'Advanced Manufacturing & Engineering', 'No sindicalizado'),
    ('5174', 'Ana Paola Campos Nolasco', 'Semanal', 'Aerospace', 'Mexicano', 'Advanced Manufacturing & Engineering', 'No sindicalizado'),
    ('5175', 'Manuel Valles Carrasco', 'Catorcenal', 'Aerospace', 'Mexicano', 'ADD-IT', 'No sindicalizado'),
    ('5185', 'Cesar Omar Jalomo Gone', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5194', 'Betsabe Cortes Almanza', 'Semanal', 'Aerospace', 'Mexicano', 'Recursos Humanos', 'No sindicalizado'),
    ('5274', 'Luis Antonio Niño Rodriguez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5275', 'Jonathan Orlando Martinez Vazquez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5276', 'Zuleyma Salazar Alvarado', 'Semanal', 'Aerospace', 'Mexicano', 'Producción', 'Sindicalizado'),
    ('5277', 'Lesly Alondra Jasso Silva', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5293', 'Elizabeth Becerra Mendez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5294', 'Gerardo Ornelas Flores', 'Semanal', 'Aerospace', 'Mexicano', 'Producción', 'Sindicalizado'),
    ('5297', 'Jesus Alejandro Mejia Bojorjes', 'Catorcenal', 'Aerospace', 'Mexicano', 'ADD-IT', 'No sindicalizado'),
    ('5338', 'Luz Antonia Salazar Campillo', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5339', 'Adriana Marquez Bravo', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5340', 'Rocio Jhoana Hernandez Gaspar', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5341', 'Amado Hernandez Reyes', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5342', 'Valeria Maya Salas', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5343', 'Olga Carolina Castro Sanchez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5344', 'Ma. Del Carmen Oliva Gutierrez', 'Semanal', 'Aerospace', 'Mexicano', 'Recursos Humanos', 'Sindicalizado'),
    ('5357', 'Ximena Sarahi Torres Silva', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5358', 'Victor Manuel Garcia Ovalle', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5391', 'Jose Enrique Rodriguez Salazar', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5392', 'Paola Guadalupe Alvarado Salazar', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5393', 'Sonia Alejandra Silva Lopez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5399', 'Angel Josue Ramos Hernandez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5425', 'Marisol Lucia Gonzalez Salas', 'Semanal', 'Aerospace', 'Mexicano', 'Producción', 'Sindicalizado'),
    ('5438', 'Erick Adolfo Ramirez Campos', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5439', 'Patricia Lili Gallegos Ruedas', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5440', 'Cesar Romero Olaya', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5441', 'Victor Javier Bravo Lopez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5442', 'Gloria Esmeralda Mora Aviles', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5457', 'Leonardo Mariano Cruz', 'Catorcenal', 'Aerospace', 'Mexicano', 'EQD', 'No sindicalizado'),
    ('5483', 'Rosario De Jesus Martinez Martinez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5484', 'Jesus Alberto Cardenas Lopez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5485', 'Sandra Martinez Segura', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5486', 'Sergio Eduardo Lopez Moreno', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5487', 'Efren Jalomo Garcia', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5488', 'Carlos Eduardo Gonzalez Hernandez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5489', 'Angel Giovanni Morales Argot', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5490', 'Vanessa Ramirez Elias', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5497', 'Arturo De Jesus Hernandez Martinez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5498', 'Miguel Angel Martinez Ramirez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5514', 'Jose De Jesus Morales Gomez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5524', 'Javier Perez Orta', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5525', 'Uriel De Jesus Flores Marin', 'Semanal', 'Aerospace', '0', 'Produccion', 'Sindicalizado'),
    ('5526', 'Francisco Antonio Miranda Martinez', 'Catorcenal', 'Aerospace', 'Mexicano', 'RDD', 'No sindicalizado'),
    ('5527', 'Christian Mora Martinez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('5536', 'Jose Angel Mendez Olguin', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5537', 'Jose Alfredo Martinez Diego', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5538', 'Ezequiel Huerta Ramirez', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5573', 'Jhonatan Abdi Nieves Calderon', 'Catorcenal', 'Aerospace', 'Mexicano', 'Admin', 'No sindicalizado'),
    ('5574', 'Karen Astrid Ponce Becerra', 'Catorcenal', 'Aerospace', 'Mexicano', 'QCD', 'No sindicalizado'),
    ('5608', 'Yoshio Francisco Nieves Alvarado', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('5623', 'Arturo Gallardo Camacho', 'Semanal', 'Aerospace', 'Mexicano', 'Production', 'Sindicalizado'),
    ('810', 'Juan Mauricio Almendarez Martinez', 'Semanal', 'Aerospace', 'Mexicano', 'Produccion', 'Sindicalizado'),
    ('AC001', 'Tan Yaling', 'Desconocido', 'Aerospace', 'Chino', 'Ingenieria', 'No sindicalizado'),
    ('AC002', 'Claire Ding', 'Desconocido', 'Aerospace', 'Chino', 'ADD-IT', 'Desconocido'),
    ('AC003', 'Yu Zhu', 'Desconocido', 'Aerospace', 'Chino', 'Ingenieria', 'Desconocido'),
    ('AC005', 'Lu Yang', 'Desconocido', 'Aerospace', 'Chino', 'Ingenieria', 'Desconocido'),
    ('AC006', 'Cong Fu', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC007', 'Haobin Guan', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC008', 'Wei Zhang', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC009', 'James An', 'Desconocido', 'Aerospace', 'Chino', 'RDD/MMD/ADD', 'Desconocido'),
    ('AC010', 'Weiming Xue', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC011', 'Huaqiao Sun', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC012', 'Ping Cao', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC013', 'Kaisun Hu', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC014', 'Leifeng Kong', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC015', 'Yaojie Li', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC016', 'Lei Yuan', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
    ('AC017', 'Liying Zhou', 'Desconocido', 'Aerospace', 'Chino', 'Quality', 'Desconocido'),
    ('AC018', 'Daquan Yang', 'Desconocido', 'Aerospace', 'Chino', 'Production', 'Desconocido'),
]

# ============================================================================
# SCRIPT DE SEED
# ============================================================================
def seed_database():
    """Lee los datos de EMPLEADOS_DATA y los inserta en la tabla 'users'"""
    
    logging.info("Iniciando el script de seeding...")
    total_creados = 0
    total_omitidos = 0
    
    # Instantiate UserRepository
    user_repo = UserRepository()

    # Get a database session
    db_session = next(get_db()) # Use next() to get the session from the generator

    try:
        for emp_data in EMPLEADOS_DATA:
            # 1. Desempaquetar los datos
            (id_usuario, nombre, periodo, centro_u, 
             tipo_usuario, area, regimen) = emp_data
            
            try:
                # 2. Verificar si el usuario ya existe por 'payroll_number'
                payroll_num = id_usuario
                existing_user = user_repo.get_by_payroll_number(db_session, payroll_num)
                
                if existing_user:
                    logging.warning(f"Usuario con nómina {payroll_num} ({nombre}) ya existe. Omitiendo.")
                    total_omitidos += 1
                    continue

                # 3. Mapear y Generar datos faltantes
                name_parts = nombre.split(' ')
                first_name = name_parts[0]
                last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else 'N/A'
                
                generated_email = f"{payroll_num.lower().strip()}@miempresa.com"
                DEFAULT_PASSWORD = "Password.1234"
                DEFAULT_ROLE = "employee"
                
                # Hash the password
                hashed_password = hash_password(DEFAULT_PASSWORD)

                # 4. Crear el objeto Pydantic 'UserCreate'
                user_to_create = UserCreate(
                    name=nombre,
                    payroll_number=payroll_num,
                    periodo=periodo,
                    centro_u=centro_u,
                    tipo_usuario=tipo_usuario,
                    area=area,
                    regimen=regimen,
                    first_name=first_name,
                    last_name=last_name,
                    email=generated_email,
                    password=DEFAULT_PASSWORD, # UserCreate expects plain password
                    role=DEFAULT_ROLE,
                    employee_status='ACTIVE',
                    hire_date=date.today(),
                    position_title=area
                )
                
                # 5. Llamar a la función CRUD para crear el usuario
                # The create method in BaseRepository expects a Pydantic model
                # and will handle hashing the password if the model has a 'password' field
                # and the repository's create method is adapted for it.
                # For seeding, we need to pass the hashed password directly.
                
                # Create a dictionary for the user data, including the hashed password
                user_data_for_db = user_to_create.dict(exclude_unset=True)
                user_data_for_db.pop("password") # Remove plain password
                user_data_for_db["password_hash"] = hashed_password

                new_user = user_repo.create(db_session, obj_in=user_data_for_db)
                logging.info(f"Éxito: Creado usuario ID {new_user.id} - {new_user.name}")
                total_creados += 1

            except Exception as e:
                logging.error(f"Error al procesar a {nombre} (Nómina: {id_usuario}): {e}")
    finally:
        db_session.close() # Ensure the session is closed

    logging.info("==========================================")
    logging.info(f"Seeding completado.")
    logging.info(f"Usuarios creados: {total_creados}")
    logging.info(f"Usuarios omitidos (ya existían): {total_omitidos}")
    logging.info("==========================================")


if __name__ == "__main__":
    seed_database()