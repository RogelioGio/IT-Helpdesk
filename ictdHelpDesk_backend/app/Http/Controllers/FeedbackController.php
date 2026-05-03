<?php

namespace App\Http\Controllers;

use App\Http\Resources\FeedbackDimensionResource;
use App\Http\Resources\FeedbackResource;
use App\Models\Feedback;
use App\Models\FeedbackDimension;
use App\Models\Ticket;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function handleSubmit(Ticket $ticket, Request $request)
    {
        $request->validate([
            'response' => 'required|array',
            'response.*.dimension_id' => 'required|exists:feedbackdimension,id',
            'response.*.dimension_value' => 'required|integer|min:1|max:5',
            'suggestion' => 'nullable|string',
            'commendation' => 'nullable|string',
            'complaint' => 'nullable|string',
        ]);

        $feedback = Feedback::create([
            'ticket_id' => $ticket->id,
            'requester_id' => 1,
            'suggestion' => $request->input('suggestion'),
            'commendation' => $request->input('commendation'),
            'complaint' => $request->input('complaint'),
        ]);

        $pivotData = [];
        foreach ($request->input('response') as $response) {
            $pivotData[$response['dimension_id']] = ['dimension_value' => $response['dimension_value']];
        }
        $feedback->dimensions()->sync($pivotData);


        return (new FeedbackResource($feedback->load('dimensions')))->response();

    }

    public function getFeedback(Ticket $ticket)
    {
        $feedback = $ticket->feedback()->get();

        if (!$feedback) {
            return response()->json(['message' => 'No feedback found for this ticket'], 404);
        }

       return FeedbackResource::collection($feedback->load('dimensions'))->response();
    }


    public function getDimensions()
    {
        $dimensions = FeedbackDimension::all();
        return response(FeedbackDimensionResource::collection($dimensions));
    }
}

