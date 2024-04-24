import Spinner from 'react-spinner-material';

export default function Loader(){
    return(
        <>
         <div className='my-5 bg-white'>
        <Spinner radius={120} color={"#0d6efd"} stroke={6} visible={true} />
      </div>
        </>
    )
}