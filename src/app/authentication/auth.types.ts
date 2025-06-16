export interface Login {
<<<<<<< HEAD
    document_id: number,
=======
    document_id: string,
>>>>>>> 7d23f567d5cd6d0829fa751721be5398cea4fbb0
    password: string
}

export interface User {
    name: string,
    last_name: string,
<<<<<<< HEAD
    document_id: number,
    address: string,
    role: string,
    phone: number,
    cell_phone: number,
    birth_date: Date,
    gender:string,
    identification_type:string,
    email:string

=======
    document_id: string,
    address: string,
    phone: string,
    cell_phone: string,
    birth_date: string,
    gender: string,
    identification_type: string,
    email: string,
    password: string
>>>>>>> 7d23f567d5cd6d0829fa751721be5398cea4fbb0
}