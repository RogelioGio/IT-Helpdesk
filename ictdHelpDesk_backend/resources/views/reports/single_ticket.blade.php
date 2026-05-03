<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $reportTitle }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; margin: 0; padding: 0; }

        @page {
            margin: 150px 50px 100px 50px;
        }

        /* --- FIXED HEADER & FOOTER --- */
        .report-header {
            position: fixed;
            top: -110px;
            left: 0;
            right: 0;
            height: 100px;
            width: 100%;
        }
        .report-footer {
            position: fixed;
            bottom: -60px;
            left: 0;
            right: 0;
            width: 100%;
            height: 60px;
            border-top: 1px solid #000;
            padding-top: 10px;
        }

        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 0px; }

        /* --- SOLID BLACK BORDER SYSTEM --- */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0px;
            border: 1px solid #000;
        }
        .info-table th { background-color: #f2f2f2; border: 1px solid #000; font-size: 11px; padding: 8px; color: #000; }

        .section-wrapper { margin-bottom: 25px; width: 100%; }

        .ticket-summary-grid {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            border: 1px solid #000;
        }
        .summary-box, .activity-box {
            border: 1px solid #000 !important;
            padding: 10px;
            background: transparent;
            vertical-align: top;
        }

        .label { font-size: 9px; color: #666; text-transform: uppercase; font-weight: bold; display: block; }
        .value { font-weight: bold; font-size: 11px; margin-top: 4px; display: block; color: #000; }

        .data-table { width: 100%; border-collapse: collapse; border: 1px solid #000; table-layout: fixed; }
        .data-table th { background-color: #f2f2f2; border: 1px solid #000; font-size: 10px; padding: 6px; text-align: left; color: #000; }
        .data-table td { border: 1px solid #000; padding: 8px; font-size: 10px; vertical-align: top; background: transparent; }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            color: #000;
            display: block;
        }
    </style>
</head>
<body>

<header class="report-header">
    <table class="header-table">
        <tr>
            <td style="width: 20%; vertical-align: middle; text-align: center;">
                <img src="{{ public_path('lra-new-logo.jpg') }}" width="85">
            </td>
            <td style="text-align: center; width: 60%;">
                <p style="margin: 0; font-size: 12px;">Republika ng Pilipinas</p>
                <p style="margin: 0; font-size: 12px;">KAGAWARAN NG KATARUNGAN</p>
                <p style="margin: 0; font-size: 14px; font-weight: bold;">PANGANGASIWA SA PANTALAAN NG LUPAIN</p>
                <p style="margin: 0; font-size: 14px; font-weight: bold;">(LAND REGISTRATION AUTHORITY)</p>
                <p style="margin: 0; font-size: 10px;">East Ave. cor. NIA Rd., Diliman, Quezon City</p>
            </td>
            <td style="width: 20%; font-size: 10px; vertical-align: middle; text-align: right">ICTD Help Desk</td>
        </tr>
    </table>
</header>

<footer class="report-footer">
    <table class="footer-table" style="width: 100%; table-layout: fixed;">
            <tr>
                <td style="text-align: left; font-size: 9px; width: 33.3%;">
                    <p style="margin: 0">Report ID:</p>
                    <p style="margin: 0; font-size: 12px; font-weight: bold;">TKT-{{ $ticket->ticketId }}</p>
                </td>

                <td style="text-align: right; font-size: 10px; width: 33.3%;">
                    <p style="margin: 0">Timestamp:</p>
                    <p style="margin: 0; font-size: 12px; font-weight: bold;">{{ now()->format('M d, Y g:i A') }}</p>
                </td>
            </tr>
        </table>
</footer>

<main>
    <table class="info-table">
        <thead>
            <tr>
                <th style="text-align: center;">{{ $reportTitle }} #{{ $ticket->ticketId }}</th>
            </tr>
        </thead>
    </table>

    <div class="section-wrapper">
        <table class="ticket-summary-grid" style="border-top: none;">
            <tr>
                <td class="activity-box" colspan="2">
                    <span class="label">ACTIVITY SPECIFICATION</span>
                    <span class="value" style="font-size: 18px;">
                        {{ $ticket->activitySpecification->name ?? 'N/A' }} -
                        <span style="font-size: 14px; font-weight: normal; text-transform: none;">
                            {{ $ticket->activity->name ?? 'N/A' }}
                        </span>
                    </span>
                    <span style="font-size: 11px; margin-top: 4px; display: block;">
                        {{ $ticket->requester->office_department_division->name ?? 'Information Technology and Communication Department' }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="summary-box" style="width: 70%;">
                    <span class="label">SERVICE REQUESTER:</span>
                    <span class="value">
                        {{ $ticket->requester->name ?? ($ticket->requester->firstName . ' ' . $ticket->requester->lastName) }}
                        @if(!empty($ticket->requester->accountRole)) - {{ $ticket->requester->accountRole }} @endif
                    </span>
                    <span style="font-size: 11px; margin-top: 4px; display: block;">
                        {{ $ticket->requester->office_department_division->name ?? 'N/A' }}
                    </span>
                </td>
                <td class="summary-box" style="width: 30%; border-left: 1px solid #000;">
                    <span class="label">ASSET SERIAL NUMBER:</span>
                    <span class="value">{{ $ticket->assetSerialNumber ?? 'N/A' }}</span>
                </td>
            </tr>
        </table>
    </div>

    @if(!empty($ticket->description))
    <div class="section-wrapper">
        <span class="section-title">DESCRIPTION</span>
        <table style="border: 0">
            <tr>
                <td style="border: 0; padding: 0; font-size: 11px; color: #000;">
                    {{ $ticket->description }}
                </td>
            </tr>
        </table>
    </div>
    @endif

    @if($ticket->responder && count($ticket->responder) > 0)
    <div class="section-wrapper">
        <div class="section-title">Assigned Officers</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Officer Name</th>
                    <th style="width: 50%;">Role</th>
                </tr>
            </thead>
            <tbody>
                @foreach($ticket->responder as $user)
                    <tr>
                        <td>{{ $user->firstName }} {{ $user->lastName }}</td>
                        <td>{{ $user->role->name ?? 'Staff' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if($ticket->timeline && count($ticket->timeline) > 0)
<div class="section-wrapper">
    <div class="section-title">Ticket Timeline</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 25%;">Status Name</th>
                <th style="width: 20%;">Time</th>
                <th style="width: 20%;">Date</th>
                <th style="width: 35%;">Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach($ticket->timeline as $status)
            <tr>
                <td style="font-weight: bold;">{{ strtoupper($status->name) }}</td>
                <td>{{ $status->pivot->created_at->format('g:i A') }}</td>
                <td>{{ $status->pivot->created_at->format('M d, Y') }}</td>
                <td>
                    {{-- 1. Get the Dynamic User Name --}}


                    {{-- 2. Combine Name with Hard-Coded Action Text --}}
                    @switch(strtoupper($status->name))
                        @case('OPEN')
                            {{($ticket->requester->firstName . ' ' . $ticket->requester->lastName) }} has created the ticket
                            @break
                        @case('ASSIGNED')
                            {{ ($ticket->requester->firstName . ' ' . $ticket->requester->lastName) }} assigned the ticket to an officer
                            @break
                        @case('RESPONDED')
                            {{ ($ticket->requester->firstName . ' ' . $ticket->requester->lastName)}} has responded to the ticket and is working on it
                            @break
                        @case('RESOLVED')
                            {{ ($ticket->requester->firstName . ' ' . $ticket->requester->lastName) }} has marked the ticket as resolved
                            @break
                        @default
                            {{($ticket->requester->firstName . ' ' . $ticket->requester->lastName) }} updated the status to {{ $status->name }}
                    @endswitch
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

@if(!empty($ticket->findings) || !empty($ticket->resolution))
<div class="section-wrapper">
    <div class="section-title">Findings & Resolution</div>

    <table class="data-table">
        <thead>
            <tr>
                <th>FINDINGS</th>
            </tr>
        </thead>
        <td>
            {{ $ticket->findings }}
        </td>
    </table>
    <table class="data-table">
        <thead>
            <tr>
                <th>RESOLUTION</th>
            </tr>
        </thead>
        <td>
            {{ $ticket->resolution }}
        </td>
    </table>
</div>
@endif
</main>
</body>
</html>
