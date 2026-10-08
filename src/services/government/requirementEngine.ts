import { GovernmentService, DigiProProfile, ServiceReadiness, RequirementCheck } from '../../types';

export class ServiceRequirementEngine {
  public static calculate(
    service: GovernmentService,
    profile: DigiProProfile | null
  ): ServiceReadiness {
    const checks: RequirementCheck[] = [];

    // If profile is not provided (e.g. before consent), all requirements are pending
    if (!profile) {
      service.required_fields.forEach((field) => {
        checks.push({
          key: field,
          label: field,
          isDocument: false,
          isAvailable: false,
        });
      });
      service.required_documents.forEach((doc) => {
        checks.push({
          key: doc,
          label: doc,
          isDocument: true,
          isAvailable: false,
        });
      });

      return {
        serviceId: service.id,
        totalRequirements: checks.length,
        availableRequirements: 0,
        percentage: 0,
        checks,
        missingItems: checks.map((c) => c.label),
      };
    }

    const { citizen, documents, vehicles } = profile;
    const vehicle = vehicles && vehicles.length > 0 ? vehicles[0] : null;

    // Check Required Fields
    service.required_fields.forEach((field) => {
      const fieldKey = field.toLowerCase();
      let isAvailable = false;
      let valueSnippet: string | undefined = undefined;
      let sourceDocument: string | undefined = undefined;

      if (fieldKey.includes('name')) {
        isAvailable = Boolean(citizen.name);
        valueSnippet = citizen.name;
        sourceDocument = 'Aadhaar / DigiPro Profile';
      } else if (fieldKey.includes('birth') || fieldKey.includes('dob')) {
        isAvailable = Boolean(citizen.dob);
        valueSnippet = citizen.dob;
        sourceDocument = 'Aadhaar / Birth Certificate';
      } else if (fieldKey.includes('mobile') || fieldKey.includes('phone')) {
        isAvailable = Boolean(citizen.mobile);
        valueSnippet = citizen.mobile;
        sourceDocument = 'Aadhaar Mobile Link';
      } else if (fieldKey.includes('address')) {
        isAvailable = Boolean(citizen.address && citizen.address.line);
        valueSnippet = `${citizen.address.line}, ${citizen.address.city}, ${citizen.address.pincode}`;
        sourceDocument = 'Aadhaar / Utility Proof';
      } else if (fieldKey.includes('vehicle registration') || fieldKey.includes('registration number')) {
        if (vehicle?.registrationNumber) {
          isAvailable = true;
          valueSnippet = vehicle.registrationNumber;
          sourceDocument = 'Parivahan RC';
        }
      } else if (fieldKey.includes('make')) {
        if (vehicle?.make) {
          isAvailable = true;
          valueSnippet = vehicle.make;
          sourceDocument = 'Parivahan RC';
        }
      } else if (fieldKey.includes('model')) {
        if (vehicle?.model) {
          isAvailable = true;
          valueSnippet = vehicle.model;
          sourceDocument = 'Parivahan RC';
        }
      } else if (fieldKey.includes('chassis')) {
        if (vehicle?.chassisNumberMasked) {
          isAvailable = true;
          valueSnippet = vehicle.chassisNumberMasked;
          sourceDocument = 'Parivahan RC';
        }
      } else if (fieldKey.includes('blood group')) {
        const dlDoc = documents.find((d) => d.document_type === 'Driving Licence');
        if (dlDoc?.available_fields?.bloodGroup) {
          isAvailable = true;
          valueSnippet = String(dlDoc.available_fields.bloodGroup);
          sourceDocument = 'Driving Licence';
        }
      } else if (fieldKey.includes('occupation')) {
        if (citizen.occupation) {
          isAvailable = true;
          valueSnippet = citizen.occupation;
          sourceDocument = 'Citizen Profile';
        }
      } else if (fieldKey.includes('income')) {
        const incDoc = documents.find((d) => d.document_type === 'Income Certificate');
        if (incDoc?.available_fields?.annualIncome) {
          isAvailable = true;
          valueSnippet = String(incDoc.available_fields.annualIncome);
          sourceDocument = 'Income Certificate';
        }
      } else if (fieldKey.includes('aadhaar')) {
        const aDoc = documents.find((d) => d.document_type === 'Aadhaar');
        if (aDoc) {
          isAvailable = true;
          valueSnippet = aDoc.masked_number;
          sourceDocument = 'Aadhaar Card';
        }
      } else if (fieldKey.includes('pan')) {
        const pDoc = documents.find((d) => d.document_type === 'PAN');
        if (pDoc) {
          isAvailable = true;
          valueSnippet = pDoc.masked_number;
          sourceDocument = 'PAN Card';
        }
      } else {
        // Fallback generic search across document available_fields
        for (const doc of documents) {
          const matchKey = Object.keys(doc.available_fields).find(
            (k) => k.toLowerCase() === fieldKey || fieldKey.includes(k.toLowerCase())
          );
          if (matchKey) {
            isAvailable = true;
            valueSnippet = String(doc.available_fields[matchKey]);
            sourceDocument = doc.document_name;
            break;
          }
        }
      }

      checks.push({
        key: field,
        label: field,
        isDocument: false,
        isAvailable,
        valueSnippet,
        sourceDocument,
      });
    });

    // Check Required Documents
    service.required_documents.forEach((docType) => {
      let matchingDoc = documents.find(
        (d) =>
          d.document_type.toLowerCase() === docType.toLowerCase() ||
          d.document_name.toLowerCase().includes(docType.toLowerCase())
      );

      // Special rule: Aadhaar serves as Address Proof if explicit Address Proof is not present
      if (!matchingDoc && docType.toLowerCase().includes('address')) {
        matchingDoc = documents.find((d) => d.document_type === 'Aadhaar');
      }

      const isAvailable = Boolean(matchingDoc && matchingDoc.verification_status === 'Verified');

      checks.push({
        key: docType,
        label: docType,
        isDocument: true,
        isAvailable,
        sourceDocument: matchingDoc?.document_name || 'DigiPro Repository',
        valueSnippet: matchingDoc ? `${matchingDoc.masked_number} (${matchingDoc.issuer})` : undefined,
      });
    });

    const totalRequirements = checks.length;
    const availableRequirements = checks.filter((c) => c.isAvailable).length;
    const percentage = totalRequirements === 0 ? 100 : Math.round((availableRequirements / totalRequirements) * 100);
    const missingItems = checks.filter((c) => !c.isAvailable).map((c) => c.label);

    return {
      serviceId: service.id,
      totalRequirements,
      availableRequirements,
      percentage,
      checks,
      missingItems,
    };
  }
}
