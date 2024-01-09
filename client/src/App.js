import {useState,useEffect} from 'react'
import { useFieldArray, useForm} from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

import User from './User/user.js';
import DeleteModal from './DeleteModal/deleteModal.js';
import './App.css'

const App=()=>{
    const [users,setUserData]=useState([])
    const [formData,setFormData] = useState({
      firstName: "",
      lastName: "",
      mailId: "",
      facebook: "",
      twitter: "",
      phoneNumbers: 
        {primaryContact:"",
        secondaryContact:""}
      ,
      phNumbers: [{ number: "" }],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);

    // GET(READ)
    useEffect(() =>{
      const fetchData = async () => {
        const url = "http://localhost:8989/users";
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            setUserData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchData()
    }, []);
  

    const {register,control,formState,handleSubmit}=useForm() 
    const {errors} = formState
    const {fields,append,remove} = useFieldArray({
      name:"phNumbers",
      control
    })
    

    // POST(CREATE)
      const onSubmit = async () => {
      const url = "http://localhost:8989/users";
      const reqBody = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      };
    
      const response = await fetch(url, reqBody); 

      if (response.ok){
        const responseData = await response.json();

        console.log(responseData);
        setUserData((prevState) => [...prevState, responseData]);

        control._reset();
      }else{
        console.log("Error")
        }
      }
  
      const displayArray=()=>{
        console.log(users)
      }
      displayArray()

      // DELETE METHOD
  const onDeleteUser = (userId) => {
    setDeletingUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const onCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingUserId(null);
  };

  const onConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8989/users/${deletingUserId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUserData(users.filter((each) => each._id !== deletingUserId));
        setIsDeleteModalOpen(false);
        setDeletingUserId(null);
      }
    } catch (error) {
      console.log('Error deleting user:', error.message);
    }
  };

      // PUT(UPDATE)
      const onUpdatingUserDetails=async()=>{
        try{
          const response = await fetch(`http://localhost:8989/users/${editingUserId}`,{
            method:"PUT",
            headers:{
              'Content-Type':'application/json',
            },
            body: JSON.stringify(formData)
          });
          if(response.ok){
            const updatedUser=await response.json()
            setUserData((prev)=>prev.map(eachUser=>eachUser._id===updatedUser._id?updatedUser:eachUser))
            setFormData({
              firstName: "",
              lastName: "",
              mailId: "",
              facebook: "",
              twitter: "",
              phoneNumbers: [
                {primaryContact:"",
                secondaryContact:""}
              ],
              phNumbers: [{ number:""}],
            });

            setIsEditing(false);
            setEditingUserId(null);

            console.log("User data updated successfully")
          }else{
            console.error('Error updating user:', response.statusText);
          }
        }catch(error){
          console.log("Error while updating the user details:", error.message)
        }
      }

      const onHandleEdit = (id) => {
        const userToEdit = users.find((user) => user._id === id);
        setEditingUserId(id);
        setFormData(userToEdit);
        setIsEditing(true);
      };
    
  return (
   <div>
        <h1 className="heading"><i>MY FORM </i></h1>
        <form className="form-container" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="label-input">
            <label htmlFor="firstName"><b>FirstName</b></label>
            <input type="text" className="input" id="firstName" {...register("firstName", {required: {
              value:true,
              message:"*First name is required"
            }})} 
            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
            />
            <p className="err-msg">{errors.firstName?.message}</p>
          </div>

          <div className="label-input">
            <label htmlFor="lastName"><b>LastName</b></label>
            <input type="text" className="input" id="lastName" {...register("lastName", {required: {
            value:true,
            message:"*Last name is required"
            }})}
            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
            />
            <p className='err-msg'>{errors.lastName?.message}</p>
          </div>


          <div className="label-input">
            <label htmlFor="mail"><b>Email</b></label>
            <input
              type="text"
              className="input"
              id="mail"
              {...register("mailId", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Invalid email format",
                },
                validate: {
                  notName: (fieldValue) =>
                    fieldValue.toLowerCase() !== "name@example.com" || "Enter a different email address",
                  notBlackListed: (fieldValue) =>
                    !fieldValue.toLowerCase().endsWith("baddomain.com") || "This domain is not supported",
                },
              })}
              onChange={(e) => setFormData((prev) => ({ ...prev, mailId: e.target.value }))}
            />
              <p className="err-msg">{errors.mailId?.message}</p>
          </div>


          <div className="label-input">
            <label htmlFor="facebook"><b>Facebook</b></label>
            <input type="text" className="input" id="facebook" {...register("facebook")} onChange={(e) => setFormData((prev) => ({ ...prev, facebook: e.target.value }))}/>
          </div>

          <div className="label-input">
            <label htmlFor="twitter"><b>Twitter</b></label>
            <input type="text" className="input" id="twitter" {...register("twitter")}  onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}/>
          </div>

            <div className='contacts'>
            <div className="label-input" style={{marginRight:"10px"}}>
            <label htmlFor="primary-phone"><b>Primary Contact</b></label>
            <input
                      type="number"
                      className="input"
                      id="primary-phone"
                      {...register("phoneNumbers.primaryContact", {
                          pattern: {
                            value: /^\d+$/,
                            message: "Please enter only numbers for the primary contact",
                          },
                      })}
                      onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phoneNumbers: {
                                ...prev.phoneNumbers,
                                primaryContact: e.target.value,
                            },
                          }))
                      }
                    />
                    <p className="err-msg">{errors.phoneNumbers?.primaryContact?.message}</p>


            </div>

            <div className="label-input">
            <label htmlFor="secondary-phone"><b>Secondary Contact</b></label>
              <input
                type="number"
                className="input"
                id="secondary-phone"
                {...register("phoneNumbers.secondaryContact", {
                    pattern: {
                      value: /^\d+$/,
                      message: "Please enter only numbers for the secondary contact",
                    },
                })}
                onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumbers: {
                          ...prev.phoneNumbers,
                          secondaryContact: e.target.value,
                      },
                    }))
                }
              />
              <p className="err-msg">{errors.phoneNumbers?.secondaryContact?.message}</p>

          </div>
            </div>

            <div style={{textAlign:"center"}}>
              <label className='list-of-numbers-heading'>LIST OF CONTACTS</label>
              <div className='items'>
                {fields.map((field,i) => {
                  return(
                  <div key={field.id} style={{marginBottom:"20px"}}>
                    <input
                        placeholder="Please enter the phone number"
                        className="input"
                        style={{ marginRight: "19px" }}
                        type="number"
                        {...register(`phNumbers.${i}.number`, {
                            pattern: {
                              value: /^\d+$/,
                              message: "Please enter only numbers",
                            },
                        })}
                        onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phNumbers: {
                                  ...prev.phNumbers,
                                  [i]: { number: e.target.value },
                              },
                            }))
                        }
                      />

                    {
                      i>0 && (
                        <button type="button" onClick={()=>remove(i)} className='remove-btn'>Remove</button>
                        )
                    }
                  </div>
                )})}
                <button type="button" onClick={()=>append({number:""})} className='add-btn'>Add Phone Number</button>
              </div>
            </div>

            <div>
                    {isEditing ? (
                        <button type="button" className="btn btn-secondary m-3" onClick={onUpdatingUserDetails}>
                            Update
                        </button>
                    ) : (
                        <button type="submit" className="submit-btn">
                            Submit
                        </button>
                    )}
            </div>            
        </form>

        <DeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />

        <div>
          <h1 className='users-heading'>AVAILABLE USERS</h1>
          <ul>{users.map(eachUser=><User key = {eachUser._id} 
          userDetails={eachUser}
          handleEdit={onHandleEdit}
          handleDelete={onDeleteUser}/>)}</ul>
        </div>
        <DevTool control={control}/>
    </div>
  )
}

export default App   