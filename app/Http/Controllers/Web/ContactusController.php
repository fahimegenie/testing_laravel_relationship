<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return view('about');
    }

    public function sendmail_contactus(Request $request)
    {
        $validator = \validator::make(request()->all(), [
            'name'                  =>  'required',
            'email'                 =>  'required',
            'message'               =>  'required',
            'g-recaptcha-response'  => 'recaptcha',
        ]);

        // check if validator fails
        if($validator->fails()) {
            $errors = $validator->errors();
            return back()->with('errors',$errors)
                        ->withInput($request->all());
        }

        $email = $request->email;

        $data = array(
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
        );
        Mail::send('emails/contactus', ['data' => $data], function ($message) use ($email) {
            $message->to(CONTACTUS_SEND_TO_EMAIL, $email)->subject('Contact Us');
        });
        return back()->with('flash_message','Email Send Successfully ');
        return "Your email has been sent successfully";
    }

}
