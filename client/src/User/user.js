import './user.css'

const User = (props)=>{
    const {userDetails, handleDelete, handleEdit}=props
    const {firstName,lastName,mailId,phoneNumbers,_id} = userDetails

    const deleteUser=()=>{
        
        handleDelete(_id)
    }

    const updateUser=()=>{handleEdit(_id)}
    return(
        <li className="list-item">
            <p className='name'>{firstName} {lastName}</p>
            <p className='mail'>{mailId}</p>
            <p>{phoneNumbers[0].primaryContact}</p>
            <button onClick={updateUser}>EDIT</button>
            <button onClick={deleteUser} >DELETE</button>
        </li>
    )
}

export default User